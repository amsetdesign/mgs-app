"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { uploadImage } from "@/lib/r2";
import { slugify } from "@/lib/format";
import { ARTICLE_CATEGORIES, SUBMISSION_STATUS } from "@/lib/labels";

export type AdminState = { ok?: boolean; error?: string; message?: string };

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

// ===== Projets soumis =====
export async function updateSubmission(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase } = await requireAdmin();
  const status = str(fd, "status");
  if (!(status in SUBMISSION_STATUS)) return { error: "Statut inconnu." };
  const { error } = await supabase
    .from("submissions")
    .update({ status, payment_ref: str(fd, "payment_ref").slice(0, 120), admin_note: str(fd, "admin_note").slice(0, 2000) })
    .eq("id", str(fd, "id"));
  if (error) return { error: "Enregistrement impossible." };
  revalidatePath("/admin/soumissions");
  revalidatePath("/admin");
  return { ok: true, message: "Enregistré." };
}

// ===== Événements =====
export async function reviewEvent(fd: FormData) {
  const { supabase } = await requireAdmin();
  const approve = str(fd, "decision") === "approve";
  await supabase
    .from("events")
    .update({ status: approve ? "approved" : "rejected", review_note: approve ? "" : str(fd, "note").slice(0, 500) })
    .eq("id", str(fd, "id"));
  revalidatePath("/admin/evenements");
  revalidatePath("/evenements");
  revalidatePath("/");
}

export async function deleteEvent(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("events").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/evenements");
  revalidatePath("/evenements");
  revalidatePath("/");
}

// ===== Articles =====
const articleSchema = z.object({
  title: z.string().trim().min(3, "Titre trop court.").max(160),
  slug: z.string().trim().max(120),
  excerpt: z.string().trim().max(300, "Chapô trop long (300 caractères maximum)."),
  body: z.string().trim().max(60000),
  category: z.enum(Object.keys(ARTICLE_CATEGORIES) as [string, ...string[]]),
  artist_id: z.string().trim(),
  status: z.enum(["draft", "published"]),
});

export async function saveArticle(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase, userId } = await requireAdmin();
  const id = str(fd, "id");
  const parsed = articleSchema.safeParse({
    title: str(fd, "title"), slug: str(fd, "slug"), excerpt: str(fd, "excerpt"), body: str(fd, "body"),
    category: str(fd, "category"), artist_id: str(fd, "artist_id"), status: str(fd, "status") || "draft",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Vérifiez le formulaire." };
  const data = parsed.data;

  const cover = await uploadImage(fd.get("cover") as File | null, "articles");
  if (cover && "error" in cover) return { error: cover.error };

  const slug = slugify(data.slug || data.title).slice(0, 120) || `article-${Date.now()}`;
  const row: Record<string, unknown> = {
    title: data.title, slug, excerpt: data.excerpt, body: data.body, category: data.category,
    artist_id: data.artist_id || null, status: data.status,
  };
  if (cover) row.cover_url = cover.url;
  if (str(fd, "remove_cover") === "on") row.cover_url = "";

  if (id) {
    const { data: current } = await supabase.from("articles").select("published_at").eq("id", id).maybeSingle();
    if (data.status === "published" && !current?.published_at) row.published_at = new Date().toISOString();
    const { error } = await supabase.from("articles").update(row).eq("id", id);
    if (error) return { error: error.code === "23505" ? "Cette adresse (slug) est déjà utilisée par un autre article." : "Enregistrement impossible." };
  } else {
    row.author_id = userId;
    if (data.status === "published") row.published_at = new Date().toISOString();
    const { error } = await supabase.from("articles").insert(row);
    if (error) return { error: error.code === "23505" ? "Cette adresse (slug) est déjà utilisée par un autre article." : "Enregistrement impossible." };
  }
  revalidatePath("/actualites");
  revalidatePath(`/actualites/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("articles").delete().eq("id", str(fd, "id"));
  revalidatePath("/actualites");
  revalidatePath("/");
  redirect("/admin/articles");
}

// ===== Titres envoyés depuis l'application =====
export async function reviewSong(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.rpc("review_song", { p_song: str(fd, "id"), p_approve: str(fd, "decision") === "approve", p_note: str(fd, "note").slice(0, 500) });
  revalidatePath("/admin/titres");
  revalidatePath("/");
}

// ===== Artistes =====
const urlOrEmpty = z.string().trim().max(300).refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "Les liens des réseaux doivent commencer par https://");

export async function updateArtist(_prev: AdminState, fd: FormData): Promise<AdminState> {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id");
  const userId = str(fd, "user_id");
  const socials = z.object({ social_facebook: urlOrEmpty, social_instagram: urlOrEmpty, social_tiktok: urlOrEmpty, social_youtube: urlOrEmpty }).safeParse({
    social_facebook: str(fd, "social_facebook"), social_instagram: str(fd, "social_instagram"), social_tiktok: str(fd, "social_tiktok"), social_youtube: str(fd, "social_youtube"),
  });
  if (!socials.success) return { error: socials.error.issues[0]?.message };
  const name = str(fd, "full_name");
  if (name.length < 2) return { error: "Indiquez le nom de l'artiste." };

  const photo = await uploadImage(fd.get("avatar") as File | null, "artists");
  if (photo && "error" in photo) return { error: photo.error };

  const { error: e1 } = await supabase
    .from("artists")
    .update({ ...socials.data, bio: str(fd, "bio").slice(0, 5000), featured: fd.get("featured") === "on", verified: fd.get("verified") === "on" })
    .eq("id", id);
  const profile: Record<string, string> = { full_name: name.slice(0, 80), country: str(fd, "country").slice(0, 60) };
  if (photo) profile.avatar_url = photo.url;
  const { error: e2 } = await supabase.from("profiles").update(profile).eq("id", userId);
  if (e1 || e2) return { error: "Enregistrement impossible." };

  const { data } = await supabase.from("artists").select("slug").eq("id", id).maybeSingle();
  revalidatePath("/artistes");
  if (data?.slug) revalidatePath(`/artistes/${data.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/artistes");
  return { ok: true, message: "Fiche artiste enregistrée." };
}

// ===== Messages =====
export async function toggleMessage(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("contact_messages").update({ handled: str(fd, "handled") === "true" }).eq("id", str(fd, "id"));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
