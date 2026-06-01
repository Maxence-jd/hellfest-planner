import * as React from 'react';
import type { FestivalEvent, UserMeta, Stage } from '../../lib/types';
import { PRIORITY_SHORT } from '../../lib/constants';
import { priorityClass } from '../../lib/priority';
import { durationMinutes, toMinutes } from '../../lib/time';
import { stageShort } from '../../lib/events';

const STAGE_ORDER: Stage[] = ['Mainstage 1', 'Mainstage 2', 'Warzone', 'Valley', 'Temple', 'Altar'];

export function TimelineScreen({
  events,
  day,
  now,
  getMeta,
  openEvent,
  conflictIds,
  scrollToNowSignal,
}: {
  events: FestivalEvent[];
  day: string;
  now: Date;
  getMeta: (id: string) => UserMeta;
  openEvent: (event: FestivalEvent) => void;
  conflictIds: Set<string>;
  scrollToNowSignal: number;
}) {
  const start = 10 * 60 + 30;
  const end = 26 * 60;
  const px = 1.22;
  const height = (end - start) * px;
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const visibleStages = STAGE_ORDER.filter(stage => events.some(event => event.stage === stage));
  const stages = visibleStages.length ? visibleStages : STAGE_ORDER;

  const nowMin = (() => {
    const h = now.getHours();
    const m = now.getMinutes();
    const normalized = h < 6 ? h + 24 : h;
    return normalized * 60 + m;
  })();

  const showNow = events.some(event => event.day === day) && nowMin >= start && nowMin <= end;
  const nowTop = (nowMin - start) * px;

  React.useEffect(() => {
    if (!containerRef.current || !showNow) return;
    containerRef.current.scrollTo({ top: Math.max(0, nowTop - 210), behavior: 'smooth' });
  }, [scrollToNowSignal, showNow, nowTop]);

  return (
    <div className="timelineContainer fixedTimeline" ref={containerRef}>
      <div className="timelineGrid" style={{ gridTemplateColumns: `58px repeat(${stages.length}, 154px)` }}>
        <div className="timelineCorner" />
        {stages.map(stage => <div className="timelineStageHead" key={stage}>{stageShort(stage)}</div>)}

        <div className="timelineScale" style={{ height }}>
          {Array.from({ length: 17 }, (_, i) => (
            <span key={i} style={{ top: i * 60 * px }}>{String((10 + i) % 24).padStart(2, '0')}:30</span>
          ))}
        </div>

        {stages.map(stage => (
          <div className="timelineStageLane" key={stage} style={{ height }}>
            {Array.from({ length: 17 }, (_, i) => <i key={i} style={{ top: i * 60 * px }} />)}

            {showNow && (
              <div className="nowLine nowLineV81" style={{ top: nowTop }}>
                {stage === stages[0] && <span>{now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>}
              </div>
            )}

            {events.filter(event => event.stage === stage).map(event => {
              const meta = getMeta(event.id);
              const top = (toMinutes(event.start) - start) * px;
              const h = Math.max(34, durationMinutes(event) * px - 4);
              return (
                <button
                  key={event.id}
                  className={`timelineBlockV7 ${priorityClass(meta.priority)} ${meta.status === 'yes' ? 'selected' : ''} ${conflictIds.has(event.id) ? 'conflict' : ''}`}
                  style={{ top, height: h }}
                  onClick={() => openEvent(event)}
                >
                  <span>{event.start} · {PRIORITY_SHORT[meta.priority]}</span>
                  <b>{event.artist}</b>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
