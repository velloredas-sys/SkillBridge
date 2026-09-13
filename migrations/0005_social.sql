-- Social graph (follow/unfollow) and direct messages.

create table if not exists follows (
  follower_id text not null,
  followee_id text not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  constraint follows_no_self check (follower_id <> followee_id)
);
create index if not exists follows_followee_idx on follows (followee_id, created_at desc);
create index if not exists follows_follower_idx on follows (follower_id, created_at desc);

-- Attachments (image/gif/document) are stored the same way avatars are — a
-- small base64 data URL right on the row — so no external file storage is
-- needed. Kept bounded server-side (see MAX_ATTACHMENT_DATA_URL_LENGTH in
-- lib/server/social.ts).
create table if not exists messages (
  id serial primary key,
  sender_id text not null,
  recipient_id text not null,
  body text not null default '',
  attachment_kind text check (attachment_kind in ('image', 'file')),
  attachment_name text not null default '',
  attachment_mime text not null default '',
  attachment_data text not null default '',
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint messages_no_self check (sender_id <> recipient_id),
  constraint messages_has_content check (body <> '' or attachment_kind is not null)
);
create index if not exists messages_conv_idx on messages (sender_id, recipient_id, created_at);
create index if not exists messages_conv_rev_idx on messages (recipient_id, sender_id, created_at);
create index if not exists messages_unread_idx on messages (recipient_id, sender_id) where read_at is null;
