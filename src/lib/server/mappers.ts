import { parseRequired } from "@/lib/catalog/match";
import type {
  AttachmentKind,
  Application,
  ChatMessage,
  Opportunity,
  PortfolioItem,
  Profile,
  ProfileSummary,
  SkillRow,
  UserRole,
} from "@/lib/types";

function str(v: unknown, fallback = "") {
  return typeof v === "string" ? v : v == null ? fallback : String(v);
}

function num(v: unknown, fallback = 0) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function dateish(v: unknown) {
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "string") return v;
  return "";
}

export function mapProfile(row: Record<string, unknown> | undefined | null): Profile | null {
  if (!row) return null;
  const role = str(row.role);
  if (role !== "student" && role !== "industry" && role !== "college") return null;
  return {
    userId: str(row.user_id),
    role: role as UserRole,
    name: str(row.name),
    headline: str(row.headline),
    bio: str(row.bio),
    collegeName: str(row.college_name),
    companyName: str(row.company_name),
    location: str(row.location),
    yearLabel: str(row.year_label),
    careerGoal: str(row.career_goal),
    avatarUrl: str(row.avatar_url),
  };
}

export function mapSkill(row: Record<string, unknown>): SkillRow {
  const assessed = row.assessed_level;
  return {
    skillId: str(row.skill_id),
    selfLevel: num(row.self_level),
    assessedLevel: assessed == null ? null : num(assessed),
  };
}

export function mapOpportunity(row: Record<string, unknown>): Opportunity {
  const mode = str(row.work_mode, "hybrid");
  const kind = str(row.kind, "internship");
  return {
    id: num(row.id),
    posterUserId: str(row.poster_user_id),
    company: str(row.company),
    title: str(row.title),
    kind: kind === "job" ? "job" : "internship",
    location: str(row.location),
    workMode: mode === "remote" || mode === "onsite" ? mode : "hybrid",
    stipend: str(row.stipend),
    duration: str(row.duration),
    description: str(row.description),
    requiredSkills: parseRequired(row.required_skills),
    deadline: str(row.deadline),
    open: Boolean(row.open),
    createdAt: dateish(row.created_at),
    isDemo: str(row.poster_user_id) === "seed",
  };
}

export function mapApplication(row: Record<string, unknown>): Application {
  const status = str(row.status, "applied");
  return {
    id: num(row.id),
    userId: str(row.user_id),
    opportunityId: num(row.opportunity_id),
    matchPct: num(row.match_pct),
    coverNote: str(row.cover_note),
    status: status === "shortlisted" || status === "rejected" ? status : "applied",
    createdAt: dateish(row.created_at),
  };
}

export function mapProfileSummary(row: Record<string, unknown>): ProfileSummary {
  const role = str(row.role);
  return {
    userId: str(row.user_id),
    role: role === "industry" || role === "college" ? role : "student",
    name: str(row.name),
    headline: str(row.headline),
    avatarUrl: str(row.avatar_url),
    collegeName: str(row.college_name),
    companyName: str(row.company_name),
  };
}

function attachmentKind(v: unknown): AttachmentKind | null {
  return v === "image" || v === "file" ? v : null;
}

export function mapMessage(row: Record<string, unknown>): ChatMessage {
  return {
    id: num(row.id),
    senderId: str(row.sender_id),
    recipientId: str(row.recipient_id),
    body: str(row.body),
    attachmentKind: attachmentKind(row.attachment_kind),
    attachmentName: str(row.attachment_name),
    attachmentMime: str(row.attachment_mime),
    attachmentData: str(row.attachment_data),
    createdAt: dateish(row.created_at),
    readAt: row.read_at == null ? null : dateish(row.read_at),
  };
}

export function mapPortfolio(row: Record<string, unknown>): PortfolioItem {
  const kind = str(row.kind, "project");
  return {
    id: num(row.id),
    kind: kind === "certification" || kind === "achievement" ? kind : "project",
    title: str(row.title),
    description: str(row.description),
    url: str(row.url),
    skills: str(row.skills),
    createdAt: dateish(row.created_at),
  };
}
