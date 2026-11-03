import "server-only";
import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";

/** Envoi par le Gmail dédié de MGS (SMTP_HOST, SMTP_USER, SMTP_PASS = mot de passe d'application). */
export const mailConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Gabarit simple : titre, paragraphes, tableau de détails, bouton facultatif. */
function render({ title, paragraphs, rows = [], cta }: { title: string; paragraphs: string[]; rows?: [string, string][]; cta?: { label: string; href: string } }) {
  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#faf8fb;font-family:Arial,Helvetica,sans-serif;color:#0c090f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0c090f;padding:18px 24px;color:#e7a8e7;font-weight:bold;letter-spacing:2px;font-size:12px">MUSIC GOSPEL SÉNÉGAL</td></tr>
<tr><td style="padding:28px 24px">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${esc(title)}</h1>
${paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6">${esc(p)}</p>`).join("")}
${rows.length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:8px 0 16px;font-size:14px">${rows.map(([k, v]) => `<tr><td style="padding:6px 0;color:#6d6474;width:38%;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;white-space:pre-line">${esc(v)}</td></tr>`).join("")}</table>` : ""}
${cta ? `<p style="margin:20px 0 0"><a href="${esc(cta.href)}" style="display:inline-block;background:#800080;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold;font-size:14px">${esc(cta.label)}</a></p>` : ""}
</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #e8e1ec;font-size:12px;color:#6d6474">${esc(SITE.name)} · ${esc(SITE.email)} · ${esc(SITE.phone)}</td></tr>
</table></td></tr></table></body></html>`;
  const text = [title, "", ...paragraphs, "", ...rows.map(([k, v]) => `${k} : ${v}`), cta ? `\n${cta.label} : ${cta.href}` : ""].join("\n");
  return { html, text };
}

/**
 * Envoie un e-mail sans jamais bloquer le formulaire : un échec est seulement journalisé,
 * la demande reste enregistrée dans la base et visible dans l'administration.
 */
export async function sendMail(to: string, subject: string, content: Parameters<typeof render>[0], replyTo?: string) {
  if (!mailConfigured || !to) return false;
  try {
    const port = Number(process.env.SMTP_PORT || 465);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const { html, text } = render(content);
    await transport.sendMail({ from: `"${SITE.name}" <${process.env.SMTP_USER}>`, to, replyTo, subject, html, text });
    return true;
  } catch (err) {
    console.error("[mail] échec d'envoi", err instanceof Error ? err.message : err);
    return false;
  }
}

/** Alerte à l'équipe MGS (boîte officielle). */
export const notifyTeam = (subject: string, content: Parameters<typeof render>[0], replyTo?: string) =>
  sendMail(SITE.email, `[MGS] ${subject}`, content, replyTo);
