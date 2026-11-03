"use client";

import { useActionState } from "react";
import { linkArtist, type AdminState } from "../../actions";

export default function LinkArtistForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(linkArtist, {});
  if (state.ok) return <p className="text-sm text-plum" role="status">{state.message}</p>;
  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="id" value={id} />
      <label className="min-w-56 flex-1">
        <span className="label">Rattacher au compte de l&apos;artiste (e-mail utilisé dans l&apos;app)</span>
        <input name="email" type="email" required className="field py-2.5" />
      </label>
      <button type="submit" disabled={pending} className="btn-primary min-h-10 disabled:opacity-60">{pending ? "…" : "Rattacher"}</button>
      {state.error && <p className="basis-full text-sm text-red-700" role="alert">{state.error}</p>}
    </form>
  );
}
