import type { FestivalEvent, UserMeta } from './types';
import { DAYS } from './constants';
import { toMinutes } from './time';
import { score } from './priority';

export function sortByTime(a: FestivalEvent, b: FestivalEvent): number {
  return DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || toMinutes(a.start) - toMinutes(b.start);
}

export function sortByPriorityThenTime(getMeta: (id: string) => UserMeta) {
  return (a: FestivalEvent, b: FestivalEvent) => {
    const diff = score(getMeta(b.id)) - score(getMeta(a.id));
    return diff || sortByTime(a, b);
  };
}

export function groupByDay(events: FestivalEvent[]): Record<string, FestivalEvent[]> {
  return events.reduce((acc, event) => {
    (acc[event.day] ||= []).push(event);
    return acc;
  }, {} as Record<string, FestivalEvent[]>);
}

export function stageShort(stage: string): string {
  return stage.replace('Mainstage ', 'MS ');
}

export function findConflicts(events: FestivalEvent[]): [FestivalEvent, FestivalEvent][] {
  const pairs: [FestivalEvent, FestivalEvent][] = [];
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];
      if (a.day !== b.day) continue;
      if (toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end)) {
        pairs.push([a, b]);
      }
    }
  }
  return pairs;
}
