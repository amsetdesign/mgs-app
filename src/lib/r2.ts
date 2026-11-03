import "server-only";
import { AwsClient } from "aws4fetch";

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_IMAGE = 5 * 1024 * 1024;

export const r2Configured = () =>
  Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET && process.env.NEXT_PUBLIC_R2_PUBLIC_BASE);

export type UploadResult = { url: string } | { error: string };

/**
 * Enregistre une image (affiche, visuel de projet, couverture d'article) sur Cloudflare R2
 * et renvoie son adresse publique. Les clés restent sur le serveur.
 */
export async function uploadImage(file: File | null, folder: "events" | "submissions" | "articles" | "artists"): Promise<UploadResult | null> {
  if (!file || file.size === 0) return null;
  const ext = IMAGE_TYPES[file.type];
  if (!ext) return { error: "Image : formats JPG, PNG ou WEBP uniquement." };
  if (file.size > MAX_IMAGE) return { error: "Image trop lourde (5 Mo maximum)." };
  if (!r2Configured()) return { error: "L'envoi d'images n'est pas encore activé. Réessayez plus tard." };

  const key = `site/${folder}/${crypto.randomUUID()}.${ext}`;
  const client = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    service: "s3",
    region: "auto",
  });
  const res = await client.fetch(`https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}/${key}`, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: await file.arrayBuffer(),
  });
  if (!res.ok) return { error: "L'envoi de l'image a échoué. Réessayez." };
  return { url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_BASE!.replace(/\/$/, "")}/${key}` };
}
