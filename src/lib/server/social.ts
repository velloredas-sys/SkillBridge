import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { AttachmentKind } from "@/lib/types";
import {
  mapMessage,
  mapOpportunity,
  mapPortfolio,
  mapProfile,
  mapProfileSummary,
  mapSkill,
} from "./mappers";

// ---------------------------------------------------------------------------
// Search & public profiles
// ---------------------------------------------------------------------------

export const searchPeople = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { query: string } | undefined) => input ?? { query: "" })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const q = data.query.trim().toLowerCase();
    const rows = await sql.query<Record<string, unknown>>(
      `select p.*,
          (select count(*) from follows f where f.followee_id = p.user_id) as follower_count,
          exists(
            select 1 from follows f2
            where f2.follower_id = $1 and f2.followee_id = p.user_id
          ) as is_following
        from profiles p
        where p.user_id <> $1
          and (
            $2 = '' or
            lower(p.name) like '%' || $2 || '%' or
            lower(p.headline) like '%' || $2 || '%' or
            lower(p.college_name) like '%' || $2 || '%' or
            lower(p.company_name) like '%' || $2 || '%'
          )
        order by follower_count desc, p.name asc
        limit 40`,
      [context.userId, q],
    );
    return rows.map((row) => ({
      ...mapProfileSummary(row),
      followerCount: Number(row.follower_count ?? 0),
      isFollowing: Boolean(row.is_following),
    }));
  });

export const getPublicProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { userId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [profileRow] = await sql<Record<string, unknown>>`
      select * from profiles where user_id = ${data.userId}
    `;
    const profile = mapProfile(profileRow);
    if (!profile) return null;

    const isSelf = data.userId === context.userId;
    const [followerCountRow] = await sql<{ count: number }>`
      select count(*)::int as count from follows where followee_id = ${data.userId}
    `;
    const [followingCountRow] = await sql<{ count: number }>`
      select count(*)::int as count from follows where follower_id = ${data.userId}
    `;
    let isFollowing = false;
    if (!isSelf) {
      const rows = await sql`
        select 1 from follows where follower_id = ${context.userId} and followee_id = ${data.userId}
      `;
      isFollowing = rows.length > 0;
    }

    const skillRows = await sql<Record<string, unknown>>`
      select * from student_skills where user_id = ${data.userId}
    `;
    const portRows =
      profile.role === "student"
        ? await sql<Record<string, unknown>>`
            select * from portfolio_items where user_id = ${data.userId} order by created_at desc limit 12
          `
        : [];
    const jobRows =
      profile.role === "industry"
        ? await sql<Record<string, unknown>>`
            select * from opportunities where poster_user_id = ${data.userId} and open = true
            order by created_at desc limit 12
          `
        : [];

    return {
      ...profile,
      followerCount: Number(followerCountRow?.count ?? 0),
      followingCount: Number(followingCountRow?.count ?? 0),
      isFollowing,
      isSelf,
      skills: skillRows.map(mapSkill),
      portfolio: portRows.map(mapPortfolio),
      postedJobs: jobRows.map(mapOpportunity),
    };
  });

export const listFollowers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { userId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select p.*, exists(
        select 1 from follows f2 where f2.follower_id = ${context.userId} and f2.followee_id = p.user_id
      ) as is_following
      from follows f
      join profiles p on p.user_id = f.follower_id
      where f.followee_id = ${data.userId}
      order by f.created_at desc
      limit 100
    `;
    return rows.map((row) => ({ ...mapProfileSummary(row), isFollowing: Boolean(row.is_following) }));
  });

export const listFollowing = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { userId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select p.*, exists(
        select 1 from follows f2 where f2.follower_id = ${context.userId} and f2.followee_id = p.user_id
      ) as is_following
      from follows f
      join profiles p on p.user_id = f.followee_id
      where f.follower_id = ${data.userId}
      order by f.created_at desc
      limit 100
    `;
    return rows.map((row) => ({ ...mapProfileSummary(row), isFollowing: Boolean(row.is_following) }));
  });

export const toggleFollow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; follow: boolean }) => input)
  .handler(async ({ context, data }) => {
    if (data.userId === context.userId) throw new Error("You can't follow yourself");
    const sql = await getSql();
    const [target] = await sql<Record<string, unknown>>`
      select user_id from profiles where user_id = ${data.userId}
    `;
    if (!target) throw new Error("Profile not found");
    if (data.follow) {
      await sql`
        insert into follows (follower_id, followee_id)
        values (${context.userId}, ${data.userId})
        on conflict do nothing
      `;
    } else {
      await sql`
        delete from follows where follower_id = ${context.userId} and followee_id = ${data.userId}
      `;
    }
    const [followerCountRow] = await sql<{ count: number }>`
      select count(*)::int as count from follows where followee_id = ${data.userId}
    `;
    return { ok: true as const, isFollowing: data.follow, followerCount: Number(followerCountRow?.count ?? 0) };
  });

// ---------------------------------------------------------------------------
// Direct messages
// ---------------------------------------------------------------------------

// Client downscales images before sending (see resizeImageFile in
// messages.$userId.tsx); documents are capped by picking small files. Either
// way, never trust the client — cap the stored base64 length server-side too.
// ~4MB of base64 covers a several-MB original file with headroom.
const MAX_ATTACHMENT_DATA_URL_LENGTH = 4_000_000;
const MAX_ATTACHMENT_NAME_LENGTH = 200;

function normalizeAttachment(input: {
  attachmentKind?: AttachmentKind | null;
  attachmentName?: string;
  attachmentMime?: string;
  attachmentData?: string;
}) {
  const kind = input.attachmentKind ?? null;
  if (!kind) return { kind: null, name: "", mime: "", data: "" };
  if (kind !== "image" && kind !== "file") throw new Error("Invalid attachment");
  const data = (input.attachmentData ?? "").trim();
  if (!data.startsWith("data:")) throw new Error("Invalid attachment data");
  if (data.length > MAX_ATTACHMENT_DATA_URL_LENGTH) throw new Error("Attachment is too large");
  const mime = (input.attachmentMime ?? "").trim();
  if (kind === "image" && !mime.startsWith("image/")) throw new Error("Invalid image attachment");
  const name = (input.attachmentName ?? "").trim().slice(0, MAX_ATTACHMENT_NAME_LENGTH);
  return { kind, name, mime, data };
}

export const listConversations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      `with pairs as (
          select
            case when sender_id = $1 then recipient_id else sender_id end as other_id,
            body, attachment_kind, sender_id, created_at
          from messages
          where sender_id = $1 or recipient_id = $1
        ),
        latest as (
          select distinct on (other_id) other_id, body, attachment_kind, sender_id, created_at
          from pairs
          order by other_id, created_at desc
        )
        select l.*, p.name, p.avatar_url, p.role, p.headline,
          (
            select count(*) from messages m2
            where m2.sender_id = l.other_id and m2.recipient_id = $1 and m2.read_at is null
          ) as unread_count
        from latest l
        join profiles p on p.user_id = l.other_id
        order by l.created_at desc`,
      [context.userId],
    );
    return rows.map((row) => ({
      otherUserId: String(row.other_id ?? ""),
      name: String(row.name ?? ""),
      avatarUrl: String(row.avatar_url ?? ""),
      role: (row.role === "industry" || row.role === "college" ? row.role : "student") as
        | "student"
        | "industry"
        | "college",
      headline: String(row.headline ?? ""),
      lastBody: String(row.body ?? ""),
      lastAttachmentKind: (row.attachment_kind === "image" || row.attachment_kind === "file"
        ? row.attachment_kind
        : null) as AttachmentKind | null,
      lastSenderId: String(row.sender_id ?? ""),
      lastAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at ?? ""),
      unreadCount: Number(row.unread_count ?? 0),
    }));
  });

export const getUnreadMessageCount = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const [row] = await sql<{ count: number }>`
      select count(*)::int as count from messages where recipient_id = ${context.userId} and read_at is null
    `;
    return { count: Number(row?.count ?? 0) };
  });

export const getConversation = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { userId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [profileRow] = await sql<Record<string, unknown>>`
      select * from profiles where user_id = ${data.userId}
    `;
    const profile = mapProfileSummary(profileRow ?? {});
    if (!profileRow) return null;

    const rows = await sql<Record<string, unknown>>`
      select * from messages
      where (sender_id = ${context.userId} and recipient_id = ${data.userId})
         or (sender_id = ${data.userId} and recipient_id = ${context.userId})
      order by created_at asc
      limit 300
    `;
    await sql`
      update messages set read_at = now()
      where sender_id = ${data.userId} and recipient_id = ${context.userId} and read_at is null
    `;
    return { profile, messages: rows.map(mapMessage) };
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      recipientId: string;
      body: string;
      attachmentKind?: AttachmentKind | null;
      attachmentName?: string;
      attachmentMime?: string;
      attachmentData?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    if (data.recipientId === context.userId) throw new Error("You can't message yourself");
    const sql = await getSql();
    const [recipient] = await sql<Record<string, unknown>>`
      select user_id from profiles where user_id = ${data.recipientId}
    `;
    if (!recipient) throw new Error("Recipient not found");

    const body = data.body.trim().slice(0, 4000);
    const attachment = normalizeAttachment(data);
    if (!body && !attachment.kind) throw new Error("Message is empty");

    const rows = await sql.query<Record<string, unknown>>(
      `insert into messages (sender_id, recipient_id, body, attachment_kind, attachment_name, attachment_mime, attachment_data)
       values ($1,$2,$3,$4,$5,$6,$7)
       returning *`,
      [context.userId, data.recipientId, body, attachment.kind, attachment.name, attachment.mime, attachment.data],
    );
    return mapMessage(rows[0]);
  });
