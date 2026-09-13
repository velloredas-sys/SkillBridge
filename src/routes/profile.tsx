import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useMe } from "@/hooks/use-me";
import { CAREER_GOALS } from "@/lib/catalog/roles";
import { saveProfile } from "@/lib/server/me";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

const ROLE_COPY: { id: UserRole; title: string; blurb: string }[] = [
  { id: "student", title: "Student", blurb: "Quizzes, roadmaps, applications, portfolio." },
  { id: "industry", title: "Recruiter", blurb: "Post roles and rank applicants by skill match." },
  { id: "college", title: "College", blurb: "Campus skill-gap desk vs industry demand." },
];

function ProfilePage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

/** Downscale + crop to a square JPEG so the photo stays tiny (a few KB to
 * ~50KB) — cheap to store as a plain text column and cheap to send back down
 * on every page load. Runs entirely in the browser before we touch the network. */
const AVATAR_SIZE = 200;

function resizeAvatarFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That doesn't look like an image"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Could not process image"));
        // Crop to a centered square before scaling, so faces don't get squashed.
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function Inner() {
  const { me } = useMe();
  const profile = me?.profile;
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [yearLabel, setYearLabel] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setHeadline(profile.headline);
    setBio(profile.bio);
    setCollegeName(profile.collegeName);
    setCompanyName(profile.companyName);
    setLocation(profile.location);
    setYearLabel(profile.yearLabel);
    setCareerGoal(profile.careerGoal);
    setRole(profile.role);
    setAvatarUrl(profile.avatarUrl);
  }, [profile]);

  const mut = useMutation({
    mutationFn: () =>
      saveProfile({
        data: {
          role,
          name,
          headline,
          bio,
          collegeName,
          companyName,
          location,
          yearLabel,
          careerGoal,
          avatarUrl,
        },
      }),
    onSuccess: () => {
      toast(role === profile?.role ? "Profile saved" : `Switched to ${role === "industry" ? "Recruiter" : role === "college" ? "College" : "Student"} workspace`);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save"),
  });

  async function handleAvatarPick(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setAvatarBusy(true);
    try {
      setAvatarUrl(await resizeAvatarFile(file));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not use that photo");
    } finally {
      setAvatarBusy(false);
    }
  }

  if (!profile) return null;

  return (
    <form
      className="max-w-xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate();
      }}
    >
      <h1 className="text-3xl">Account</h1>
      <p className="text-sm text-muted-foreground">
        Switch workspaces without creating a new account. Skills, applications, and portfolio stay on this login.
      </p>
      <div>
        <Label>Profile photo</Label>
        <div className="mt-2 flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span className="grid h-16 w-16 place-items-center rounded-full bg-sage text-lg font-medium">
              {(name || "?").charAt(0).toUpperCase()}
            </span>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" type="button">
              <label className="cursor-pointer">
                {avatarBusy ? "Processing…" : avatarUrl ? "Change photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={avatarBusy}
                  onChange={(e) => handleAvatarPick(e.target.files?.[0])}
                />
              </label>
            </Button>
            {avatarUrl ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setAvatarUrl("")}
              >
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <div>
        <Label>Workspace</Label>
        <div className="mt-2 grid gap-2">
          {ROLE_COPY.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={cn(
                "rounded-lg border px-3 py-3 text-left",
                role === r.id ? "border-primary bg-sage" : "border-border bg-card",
              )}
            >
              <span className="block font-sans text-sm font-semibold">{r.title}</span>
              <span className="text-xs text-muted-foreground">{r.blurb}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="n">Name</Label>
        <Input id="n" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="h">Headline</Label>
        <Input id="h" value={headline} onChange={(e) => setHeadline(e.target.value)} />
      </div>
      {role !== "industry" ? (
        <div>
          <Label htmlFor="c">College</Label>
          <Input id="c" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} />
        </div>
      ) : (
        <div>
          <Label htmlFor="co">Company</Label>
          <Input id="co" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
      )}
      <div>
        <Label htmlFor="l">City</Label>
        <Input id="l" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      {role === "student" ? (
        <>
          <div>
            <Label htmlFor="y">Year</Label>
            <Input id="y" value={yearLabel} onChange={(e) => setYearLabel(e.target.value)} />
          </div>
          <div>
            <Label>Career goal</Label>
            <div className="mt-2 grid gap-2">
              {CAREER_GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setCareerGoal(g.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-sm",
                    careerGoal === g.id ? "border-primary bg-sage" : "border-border bg-card",
                  )}
                >
                  {g.title}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}
      <div>
        <Label htmlFor="b">Bio</Label>
        <Textarea id="b" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <Button type="submit" disabled={mut.isPending}>
        {mut.isPending ? "Saving…" : "Save account"}
      </Button>
      {role === "student" ? (
        <p className="text-sm">
          <Link to="/portfolio" className="text-primary hover:underline">
            Open portfolio
          </Link>
        </p>
      ) : null}
    </form>
  );
}
