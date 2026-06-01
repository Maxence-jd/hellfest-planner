import type { FestivalEvent, UserMeta } from '../../lib/types';
import { PRIORITY_LABELS } from '../../lib/constants';
import { groupByDay, sortByTime, stageShort } from '../../lib/events';
import { priorityClass } from '../../lib/priority';

export function MyHellfestScreen({
  selected,
  getMeta,
  openEvent,
  conflictCount,
}: {
  selected: FestivalEvent[];
  getMeta: (id: string) => UserMeta;
  openEvent: (event: FestivalEvent) => void;
  conflictCount: number;
}) {
  const byDay = groupByDay([...selected].sort(sortByTime));

  return (
    <div className="screen">
      <div className={`confBanner ${conflictCount ? 'bad' : ''}`}>
        {conflictCount ? `⚠️ ${conflictCount} conflit(s) dans ton Hellfest` : '✅ Aucun conflit dans ton Hellfest'}
      </div>

      <section className="prioritySummary">
        {[1,2,3,4,5].map(priority => (
          <div key={priority} className={`summaryBox p${priority}`}>
            <b>P{priority}</b><span>{selected.filter(event => getMeta(event.id).priority === String(priority)).length}</span>
          </div>
        ))}
      </section>

      {selected.length === 0 && <p className="emptyState">Coche des concerts avec l’étoile pour construire ton Hellfest.</p>}

      {Object.entries(byDay).map(([day, events]) => (
        <section key={day} className="dayPlan">
          <h2>{day}</h2>
          {events.map(event => {
            const meta = getMeta(event.id);
            return (
              <button key={event.id} className={`planItem ${priorityClass(meta.priority)}`} onClick={() => openEvent(event)}>
                <span>{event.start}<small>{event.end}</small></span>
                <b>{event.artist}<small>{stageShort(event.stage)} · {PRIORITY_LABELS[meta.priority]}{meta.criterion ? ` · ${meta.criterion}` : ''}</small></b>
              </button>
            );
          })}
        </section>
      ))}
    </div>
  );
}
