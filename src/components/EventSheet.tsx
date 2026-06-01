import { X } from 'lucide-react';
import type { Criterion, FestivalEvent, UserMeta } from '../lib/types';
import { CRITERIA, PRIORITY_LABELS } from '../lib/constants';
import { priorityClass, statusLabel } from '../lib/priority';

export function EventSheet({
  event,
  meta,
  updateMeta,
  close,
}: {
  event: FestivalEvent;
  meta: UserMeta;
  updateMeta: (id: string, patch: Partial<UserMeta>) => void;
  close: () => void;
}) {
  return (
    <div className="sheetBackdrop" onClick={close}>
      <section className="eventSheet" onClick={e => e.stopPropagation()}>
        <button className="closeButton" onClick={close}><X size={22}/></button>
        <span className="eventTime">{event.day} · {event.start} → {event.end} · {event.stage}</span>
        <h2>{event.artist}</h2>
        <div className={`priorityBadge ${priorityClass(meta.priority)}`}>{PRIORITY_LABELS[meta.priority || '']}</div>

        <label>À voir
          <select value={meta.status} onChange={e => updateMeta(event.id, { status: e.target.value as any })}>
            <option value="">Non défini</option>
            <option value="yes">Oui</option>
            <option value="maybe">Peut-être</option>
            <option value="no">Non</option>
          </select>
        </label>

        <label>Priorité
          <select value={meta.priority} onChange={e => updateMeta(event.id, { priority: e.target.value as any })}>
            <option value="">-</option>
            <option value="1">P1 · Immanquable</option>
            <option value="2">P2 · Très important</option>
            <option value="3">P3 · Important</option>
            <option value="4">P4 · Si possible</option>
            <option value="5">P5 · Bonus</option>
          </select>
        </label>

        <label>Critère
          <select value={meta.criterion} onChange={e => updateMeta(event.id, { criterion: e.target.value as Criterion })}>
            {CRITERIA.map(criterion => <option key={criterion} value={criterion}>{criterion || '-'}</option>)}
          </select>
        </label>

        <label>Commentaire
          <textarea rows={4} value={meta.comment} onChange={e => updateMeta(event.id, { comment: e.target.value })} placeholder="Note perso, pote, conflit, arriver avant..." />
        </label>

        <div className="notificationToggles">
          <label><input type="checkbox" checked={!!meta.notify30} onChange={e => updateMeta(event.id, { notify30: e.target.checked })}/> 30 min avant</label>
          <label><input type="checkbox" checked={!!meta.notify10} onChange={e => updateMeta(event.id, { notify10: e.target.checked })}/> 10 min avant</label>
          <label><input type="checkbox" checked={!!meta.notifyStart} onChange={e => updateMeta(event.id, { notifyStart: e.target.checked })}/> Au début</label>
        </div>

        <p className="muted">Statut actuel : {statusLabel(meta.status)}</p>
      </section>
    </div>
  );
}
