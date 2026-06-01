import type { FestivalEvent, UserMeta } from '../../lib/types';
import { PRIORITY_LABELS } from '../../lib/constants';
import { priorityClass } from '../../lib/priority';

export function ConflictsScreen({
  conflicts,
  getMeta,
  openEvent,
}: {
  conflicts: [FestivalEvent, FestivalEvent][];
  getMeta: (id: string) => UserMeta;
  openEvent: (event: FestivalEvent) => void;
}) {
  if (!conflicts.length) {
    return <div className="screen"><div className="emptyState">✅ Aucun conflit dans ta sélection.</div></div>;
  }

  return (
    <div className="screen">
      {conflicts.map(([a, b]) => {
        const ma = getMeta(a.id);
        const mb = getMeta(b.id);
        const critical = ma.priority === '1' || mb.priority === '1';
        return (
          <article key={`${a.id}-${b.id}`} className={`conflictCard ${critical ? 'critical' : ''}`}>
            <h2>{critical ? '⚠️ Conflit critique' : '⚠️ Conflit'}</h2>
            <button className={priorityClass(ma.priority)} onClick={() => openEvent(a)}>
              <b>{a.artist}</b><span>{a.day} · {a.start}-{a.end} · {a.stage} · {PRIORITY_LABELS[ma.priority]}</span>
            </button>
            <div className="vs">VS</div>
            <button className={priorityClass(mb.priority)} onClick={() => openEvent(b)}>
              <b>{b.artist}</b><span>{b.day} · {b.start}-{b.end} · {b.stage} · {PRIORITY_LABELS[mb.priority]}</span>
            </button>
            {ma.priority && mb.priority && ma.priority !== mb.priority && (
              <p className="suggestion">Suggestion : garde le plus prioritaire ({Number(ma.priority) < Number(mb.priority) ? a.artist : b.artist}).</p>
            )}
          </article>
        );
      })}
    </div>
  );
}
