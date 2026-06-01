import { Star, Trophy } from 'lucide-react';
import type { FestivalEvent, UserMeta } from '../../lib/types';
import { PRIORITY_LABELS } from '../../lib/constants';
import { priorityClass } from '../../lib/priority';
import { sortByPriorityThenTime, stageShort } from '../../lib/events';

export function AgendaScreen({
  events,
  getMeta,
  updateMeta,
  openEvent,
  conflictIds,
}: {
  events: FestivalEvent[];
  getMeta: (id: string) => UserMeta;
  updateMeta: (id: string, patch: Partial<UserMeta>) => void;
  openEvent: (event: FestivalEvent) => void;
  conflictIds: Set<string>;
}) {
  const top = [...events].sort(sortByPriorityThenTime(getMeta))[0];

  return (
    <div className="screen">
      <section className="heroCard">
        <div>
          <span className="eyebrow">À ne pas rater</span>
          <b>{top?.artist || 'Aucun concert'}</b>
          <small>{top ? `${top.start} → ${top.end} · ${top.stage}` : 'Change tes filtres.'}</small>
        </div>
        <Trophy size={30}/>
      </section>

      <div className="concertList">
        {events.map(event => {
          const meta = getMeta(event.id);
          return (
            <article key={event.id} className={`concertCard ${priorityClass(meta.priority)} ${meta.status === 'yes' ? 'selected' : ''} ${conflictIds.has(event.id) ? 'conflict' : ''}`}>
              <button className="starButton" onClick={() => updateMeta(event.id, { status: meta.status === 'yes' ? '' : 'yes' })}>
                <Star size={22} fill={meta.status === 'yes' ? 'currentColor' : 'none'} />
              </button>
              <button className="concertBody" onClick={() => openEvent(event)}>
                <span className="eventTime">{event.start} → {event.end}</span>
                <strong>{event.artist}</strong>
                <span className="eventMeta">{stageShort(event.stage)} · {PRIORITY_LABELS[meta.priority]}{meta.criterion ? ` · ${meta.criterion}` : ''}</span>
                {meta.comment && <span className="eventNote">📝 {meta.comment}</span>}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
