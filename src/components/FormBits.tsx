// Petits éléments communs aux formulaires publics
export function Field({ label, hint, children, required }: { label: string; hint?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="label">{label}{required && <span className="text-plum"> *</span>}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-mute">{hint}</span>}
    </label>
  );
}

export function Honeypot() {
  return <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />;
}

export function FormSuccess({ title, message, children }: { title: string; message?: string; children?: React.ReactNode }) {
  return (
    <div role="status" className="rounded-[var(--radius-card)] border border-plum/30 bg-white p-8 text-center">
      <p className="font-display text-2xl font-bold">{title}</p>
      {message && <p className="mx-auto mt-3 max-w-lg text-mute">{message}</p>}
      {children}
    </div>
  );
}

export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
}
