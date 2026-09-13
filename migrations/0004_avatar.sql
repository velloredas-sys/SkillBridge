-- Adds a profile picture field. Stored as a small base64 data URL directly
-- in the row (no external file storage needed) — kept tiny by resizing on
-- the client before upload (see resizeAvatarFile in profile.tsx).
alter table profiles add column if not exists avatar_url text not null default '';
