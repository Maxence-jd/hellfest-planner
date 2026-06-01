import type { FestivalEvent, Day } from './types';

export function toMinutes(time: string): number {
  let [h, m] = time.split(':').map(Number);
  if (h < 6) h += 24;
  return h * 60 + m;
}

export function durationMinutes(event: FestivalEvent): number {
  return Math.max(0, toMinutes(event.end) - toMinutes(event.start));
}

export function formatClock(date: Date): string {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function festivalDateForDay(day: Day): string {
  const map: Record<Day, string> = {
    'Jeudi 18': '2026-06-18',
    'Vendredi 19': '2026-06-19',
    'Samedi 20': '2026-06-20',
    'Dimanche 21': '2026-06-21',
  };
  return map[day];
}

export function dateForEvent(day: Day, time: string): Date {
  const base = festivalDateForDay(day);
  let [h, m] = time.split(':').map(Number);
  const date = new Date(`${base}T00:00:00`);
  if (h < 6) date.setDate(date.getDate() + 1);
  date.setHours(h, m, 0, 0);
  return date;
}

export function getCurrentFestivalDay(now: Date): Day {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if (y === 2026 && m === 6) {
    if (d === 18) return 'Jeudi 18';
    if (d === 19) return 'Vendredi 19';
    if (d === 20) return 'Samedi 20';
    if (d === 21 || d === 22) return 'Dimanche 21';
  }
  return 'Vendredi 19';
}

export function minutesUntil(now: Date, target: Date): number {
  return Math.round((target.getTime() - now.getTime()) / 60000);
}

export function isEventHappeningNow(event: FestivalEvent, now: Date): boolean {
  const start = dateForEvent(event.day, event.start);
  const end = dateForEvent(event.day, event.end);
  return now >= start && now <= end;
}

export function hasEventPassed(event: FestivalEvent, now: Date): boolean {
  return now > dateForEvent(event.day, event.end);
}
