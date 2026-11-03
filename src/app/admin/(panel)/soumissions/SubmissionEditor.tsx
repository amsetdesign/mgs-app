"use client";

import { useActionState } from "react";
import { updateSubmission, type AdminState } from "../../actions";
import { SUBMISSION_STATUS, type SubmissionStatus } from "@/lib/labels";

export default function SubmissionEditor({ id, status, paymentRef, note, paid }: { id: string; status: SubmissionStatus; paymentRef: string; note: string; paid: boolean }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(updateSubmission, {});
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[180px_1fr]">
      <input type="hidden" name="id" value={id} />
      <label className="block">
        <span className="label">Statut</span>
        <select name="status" defaultValue={status} className="field py-2.5">
          {(Object.keys(SUBMISSION_STATUS) as SubmissionStatus[]).map((s) => <option key={s} value={s}>{SUBMISSION_STATUS[s]}</option>)}
        </select>
      </label>
      {paid ? (
        <label className="block">
          <span className="label">Référence du paiement (Wave / Orange Money)</span>
          <input name="payment_ref" defaultValue={paymentRef} maxLength={120} className="field py-2.5" />
        </label>
      ) : (
        <input type="hidden" name="payment_ref" value="" />
      )}
      <label className="block sm:col-span-2">
        <span className="label">Note interne</span>
        <textarea name="admin_note" defaultValue={note} rows={2} maxLength={2000} className="field py-2.5" />
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-primary min-h-10 disabled:opacity-60">{pending ? "Enregistrement…" : "Enregistrer"}</button>
        {state.message && <span className="text-sm text-plum" role="status">{state.message}</span>}
        {state.error && <span className="text-sm text-red-700" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}
