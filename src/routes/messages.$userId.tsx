import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/person-row";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getConversation, sendMessage } from "@/lib/server/social";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { EMOJI_GROUPS } from "@/lib/catalog/emoji";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, File as FileIcon, ImageIcon, Plus, Send, Smile } from "lucide-react";
import type { AttachmentKind } from "@/lib/types";

export const Route = createFileRoute("/messages/$userId")({ component: ChatPage });

function ChatPage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

// Attachments are stored as base64 data URLs directly on the row (same trick
// as the profile avatar) — kept small client-side so the round trip stays
// cheap. Gifs are never re-encoded (canvas flattens animation to one frame),
// so they're just size-capped instead of resized.
const MAX_RAW_FILE_BYTES = 3 * 1024 * 1024; // 3MB
const MAX_IMAGE_DIM = 1000;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

function resizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that image"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That doesn't look like an image"));
      img.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Could not process image"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

type PendingAttachment = { kind: AttachmentKind; name: string; mime: string; data: string };

function Inner() {
  const { userId } = Route.useParams();
  const { user } = useCurrentUserState();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<PendingAttachment | null>(null);
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const query = useQuery({
    queryKey: ["conversation", userId],
    queryFn: () => getConversation({ data: { userId } }),
    refetchInterval: 4_000,
  });

  const mut = useMutation({
    mutationFn: (vars: { body: string; attachment: PendingAttachment | null }) =>
      sendMessage({
        data: {
          recipientId: userId,
          body: vars.body,
          attachmentKind: vars.attachment?.kind ?? null,
          attachmentName: vars.attachment?.name ?? "",
          attachmentMime: vars.attachment?.mime ?? "",
          attachmentData: vars.attachment?.data ?? "",
        },
      }),
    onSuccess: () => {
      setText("");
      setAttachment(null);
      qc.invalidateQueries({ queryKey: ["conversation", userId] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not send message"),
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [query.data?.messages.length]);

  async function handlePick(file: File | undefined, kind: AttachmentKind) {
    if (!file) return;
    setMenuOpen(false);
    if (kind === "image" && !file.type.startsWith("image/")) {
      toast.error("Please choose an image or GIF");
      return;
    }
    if (file.size > MAX_RAW_FILE_BYTES) {
      toast.error("That file is too big (max 3MB)");
      return;
    }
    setBusy(true);
    try {
      const data = kind === "image" && file.type !== "image/gif" ? await resizeImageFile(file) : await fileToDataUrl(file);
      setAttachment({ kind, name: file.name, mime: file.type || "application/octet-stream", data });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not use that file");
    } finally {
      setBusy(false);
    }
  }

  function handleSend() {
    const body = text.trim();
    if (!body && !attachment) return;
    mut.mutate({ body, attachment });
  }

  if (query.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (query.data === null) return <h1 className="text-3xl">Conversation not found</h1>;
  const data = query.data;
  if (!data) return null;
  const { profile, messages } = data;

  return (
    <div className="flex h-[calc(100dvh-9.5rem)] max-w-2xl flex-col md:h-[calc(100dvh-7.5rem)]">
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <Link to="/messages" className="text-muted-foreground hover:text-foreground md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Link to="/people/$userId" params={{ userId }} className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar name={profile.name} avatarUrl={profile.avatarUrl} size={38} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{profile.name || "Unnamed"}</p>
            <p className="truncate text-xs text-muted-foreground">{profile.headline}</p>
          </div>
        </Link>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Say hi to {profile.name || "them"} 👋
          </p>
        ) : null}
        {messages.map((m) => {
          const mine = m.senderId === user?.id;
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-soft",
                  mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-card text-foreground",
                )}
              >
                {m.attachmentKind === "image" ? (
                  <img src={m.attachmentData} alt={m.attachmentName || "attachment"} className="mb-1 max-h-64 rounded-lg object-contain" />
                ) : m.attachmentKind === "file" ? (
                  
                    href={m.attachmentData}
                    download={m.attachmentName || "file"}
                    className={cn(
                      "mb-1 flex items-center gap-2 rounded-lg border px-2 py-1.5",
                      mine ? "border-primary-foreground/30" : "border-border",
                    )}
                  >
                    <FileIcon className="h-4 w-4 shrink-0" />
                    <span className="truncate text-xs underline">{m.attachmentName || "Download file"}</span>
                  </a>
                ) : null}
                {m.body ? <p className="whitespace-pre-wrap break-words">{m.body}</p> : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border pt-3">
        {attachment ? (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs">
            {attachment.kind === "image" ? <ImageIcon className="h-4 w-4" /> : <FileIcon className="h-4 w-4" />}
            <span className="min-w-0 flex-1 truncate">{attachment.name || "Attachment"}</span>
            <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => setAttachment(null)}>
              Remove
            </button>
          </div>
        ) : null}
        <div className="flex items-end gap-2">
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="icon" aria-label="Attach" disabled={busy}>
                <Plus className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4" /> Photo or GIF
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileIcon className="h-4 w-4" /> Document
              </button>
            </PopoverContent>
          </Popover>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              void handlePick(e.target.files?.[0], "image");
              e.target.value = "";
            }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
            className="hidden"
            onChange={(e) => {
              void handlePick(e.target.files?.[0], "file");
              e.target.value = "";
            }}
          />

          <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="icon" aria-label="Emoji">
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 max-h-72 overflow-y-auto">
              {EMOJI_GROUPS.map((g) => (
                <div key={g.label} className="mb-2">
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{g.label}</p>
                  <div className="grid grid-cols-8 gap-1">
                    {g.emoji.map((e) => (
                      <button
                        key={e}
                        type="button"
                        className="rounded-md py-1 text-lg hover:bg-muted"
                        onClick={() => {
                          setText((t) => t + e);
                          setEmojiOpen(false);
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </PopoverContent>
          </Popover>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Write a message…"
            rows={1}
            className="h-11 flex-1 resize-none rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
          <Button type="button" size="icon" disabled={mut.isPending || busy || (!text.trim() && !attachment)} onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
