import type { Stage, FestivalEvent, UserMeta } from './types';
import { dateForEvent, minutesUntil, durationMinutes } from './time';
import { sortByTime } from './events';

export const STAGE_POSITIONS: Record<Stage, { x: number; y: number }> = {
  'Mainstage 1': { x: 54, y: 24 },
  'Mainstage 2': { x: 70, y: 24 },
  'Warzone': { x: 16, y: 66 },
  'Valley': { x: 36, y: 74 },
  'Temple': { x: 72, y: 68 },
  'Altar': { x: 88, y: 68 },
};

const DEFAULT_WALK = 7;

const WALK_TIMES: Record<string, number> = {
  'Mainstage 1-Mainstage 2': 2,
  'Mainstage 1-Warzone': 8,
  'Mainstage 1-Valley': 6,
  'Mainstage 1-Temple': 7,
  'Mainstage 1-Altar': 8,
  'Mainstage 2-Warzone': 9,
  'Mainstage 2-Valley': 7,
  'Mainstage 2-Temple': 6,
  'Mainstage 2-Altar': 7,
  'Warzone-Valley': 5,
  'Warzone-Temple': 9,
  'Warzone-Altar': 10,
  'Valley-Temple': 5,
  'Valley-Altar': 6,
  'Temple-Altar': 2,
};

function key(a: Stage, b: Stage) {
  return [a, b].sort().join('-');
}

export function walkingTime(a?: Stage, b?: Stage): number {
  if (!a || !b || a === b) return 0;
  return WALK_TIMES[key(a, b)] ?? DEFAULT_WALK;
}

export function selectedSorted(events: FestivalEvent[], getMeta: (id: string) => UserMeta): FestivalEvent[] {
  return events.filter(event => getMeta(event.id).status === 'yes').sort(sortByTime);
}

export function currentSelectedEvent(events: FestivalEvent[], getMeta: (id: string) => UserMeta, now: Date) {
  return selectedSorted(events, getMeta).find(event => {
    const start = dateForEvent(event.day, event.start);
    const end = dateForEvent(event.day, event.end);
    return now >= start && now <= end;
  });
}

export function nextSelectedEvent(events: FestivalEvent[], getMeta: (id: string) => UserMeta, now: Date) {
  return selectedSorted(events, getMeta).find(event => dateForEvent(event.day, event.start) > now);
}

export function routeStatus(current: FestivalEvent | undefined, next: FestivalEvent | undefined) {
  if (!current || !next) return null;
  const margin = Math.round((dateForEvent(next.day, next.start).getTime() - dateForEvent(current.day, current.end).getTime()) / 60000);
  const walk = walkingTime(current.stage, next.stage);
  return {
    from: current.stage,
    to: next.stage,
    margin,
    walk,
    safe: margin >= walk,
  };
}

export type PauseSlot = {
  day: string;
  start: string;
  end: string;
  minutes: number;
  walking: number;
  realPause: number;
  after?: FestivalEvent;
  before?: FestivalEvent;
};

export function findSmartPauses(events: FestivalEvent[], getMeta: (id: string) => UserMeta): PauseSlot[] {
  const selected = selectedSorted(events, getMeta);
  const pauses: PauseSlot[] = [];
  for (let i = 0; i < selected.length - 1; i++) {
    const a = selected[i];
    const b = selected[i + 1];
    if (a.day !== b.day) continue;
    const gap = Math.round((dateForEvent(b.day, b.start).getTime() - dateForEvent(a.day, a.end).getTime()) / 60000);
    const walking = walkingTime(a.stage, b.stage);
    const realPause = Math.max(0, gap - walking);
    if (realPause >= 35) {
      pauses.push({ day: a.day, start: a.end, end: b.start, minutes: gap, walking, realPause, after: a, before: b });
    }
  }
  return pauses;
}

export function totalWalkingMinutes(events: FestivalEvent[], getMeta: (id: string) => UserMeta): number {
  const selected = selectedSorted(events, getMeta);
  let total = 0;
  for (let i = 0; i < selected.length - 1; i++) {
    if (selected[i].day === selected[i + 1].day) total += walkingTime(selected[i].stage, selected[i + 1].stage);
  }
  return total;
}

export function totalFreeMinutes(events: FestivalEvent[], getMeta: (id: string) => UserMeta): number {
  return findSmartPauses(events, getMeta).reduce((sum, pause) => sum + pause.minutes, 0);
}

export function totalConcertMinutes(events: FestivalEvent[], getMeta: (id: string) => UserMeta): number {
  return selectedSorted(events, getMeta).reduce((sum, event) => sum + durationMinutes(event), 0);
}

export function movementCount(events: FestivalEvent[], getMeta: (id: string) => UserMeta): number {
  const selected = selectedSorted(events, getMeta);
  let count = 0;
  for (let i = 0; i < selected.length - 1; i++) {
    if (selected[i].day === selected[i + 1].day && selected[i].stage !== selected[i + 1].stage) count++;
  }
  return count;
}
