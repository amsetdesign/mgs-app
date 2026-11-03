import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { toggleMessage } from "../../actions";

const SUBJECTS: Record<string, string> = { contact: "Question", partenariat: "Partenariat", presse: "Presse", autre: "Autre" };

type Msg = { id: string; name: string; email: string; phone: string; subject: string; message: string; handled: boolean; created_at: string };

export default async function MessagesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("contact_messages").select("*").order("handled").order("created_at", { ascending: false }).limit(300);
  const msgs = (data ?? []) as Msg[];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Messages</h1>
        <p className="mt-1 text-mute">Les messages envoyés depuis la page Contact.</p>
      </div>
      {msgs.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-white p-8 text-center text-mute">Aucun message.</p>
      ) : (
        <ul className="space-y-3">
          {msgs.map((m) => (
            <li key={m.id} className={`rounded-[var(--radius-card)] bg-white p-5 ${m.handled ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold">{SUBJECTS[m.subject] ?? m.subject}</span>
                <span className="font-medium">{m.name}</span>
                <a href={`mailto:${m.email}`} className="text-sm text-plum underline">{m.email}</a>
                {m.phone && <a href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-plum underline">{m.phone}</a>}
                <span className="ml-auto text-xs text-mute">{formatDate(m.created_at, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <p className="mt-3 whitespace-pre-line">{m.message}</p>
              <form action={toggleMessage} className="mt-3">
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="handled" value={m.handled ? "false" : "true"} />
                <button className="text-sm text-mute underline">{m.handled ? "Marquer comme à traiter" : "Marquer comme traité"}</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
