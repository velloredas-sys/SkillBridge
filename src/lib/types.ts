export type UserRole = "student" | "industry" | "college";

export type Profile = {
  userId: string;
  role: UserRole;
  name: string;
  headline: string;
  bio: string;
  collegeName: string;
  companyName: string;
  location: string;
  yearLabel: string;
  careerGoal: string;
  avatarUrl: string;
};

export type SkillRow = {
  skillId: string;
  selfLevel: number;
  assessedLevel: number | null;
};

export type PortfolioItem = {
  id: number;
  kind: "project" | "certification" | "achievement";
  title: string;
  description: string;
  url: string;
  skills: string;
  createdAt: string;
};

export type Opportunity = {
  id: number;
  posterUserId: string;
  company: string;
  title: string;
  kind: "internship" | "job";
  location: string;
  workMode: "remote" | "hybrid" | "onsite";
  stipend: string;
  duration: string;
  description: string;
  requiredSkills: { id: string; level: number }[];
  deadline: string;
  open: boolean;
  createdAt: string;
  isDemo: boolean;
};

export type Application = {
  id: number;
  userId: string;
  opportunityId: number;
  matchPct: number;
  coverNote: string;
  status: "applied" | "shortlisted" | "rejected";
  createdAt: string;
};

export type Me = {
  profile: Profile | null;
  skills: SkillRow[];
  progress: string[];
  applications: Application[];
  portfolio: PortfolioItem[];
  myJobs: Opportunity[];
};

export type ProfileSummary = {
  userId: string;
  role: UserRole;
  name: string;
  headline: string;
  avatarUrl: string;
  collegeName: string;
  companyName: string;
};

export type PersonResult = ProfileSummary & {
  followerCount: number;
  isFollowing: boolean;
};

export type PublicProfile = Profile & {
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isSelf: boolean;
  skills: SkillRow[];
  portfolio: PortfolioItem[];
  postedJobs: Opportunity[];
};

export type AttachmentKind = "image" | "file";

export type ChatMessage = {
  id: number;
  senderId: string;
  recipientId: string;
  body: string;
  attachmentKind: AttachmentKind | null;
  attachmentName: string;
  attachmentMime: string;
  attachmentData: string;
  createdAt: string;
  readAt: string | null;
};

export type ConversationSummary = {
  otherUserId: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  headline: string;
  lastBody: string;
  lastAttachmentKind: AttachmentKind | null;
  lastSenderId: string;
  lastAt: string;
  unreadCount: number;
};
