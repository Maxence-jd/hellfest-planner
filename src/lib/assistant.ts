import type { FestivalEvent, UserMeta } from './types';
import { dateForEvent, minutesUntil } from './time';
import { currentSelectedEvent, nextSelectedEvent, routeStatus, findSmartPauses, walkingTime } from './festivalMap';

export type DayAssistant = {
  current?: FestivalEvent;
  next?: FestivalEvent;
  route: ReturnType<typeof routeStatus>;
  departureAdvice?: string;
  nextPause?: ReturnType<typeof findSmartPauses>[number];
  recommendations: string[];
};

export function buildDayAssistant(events: FestivalEvent[], getMeta: (id: string) => UserMeta, now: Date): DayAssistant {
  const current = currentSelectedEvent(events, getMeta, now);
  const next = nextSelectedEvent(events, getMeta, now);
  const route = routeStatus(current, next);
  const pauses = findSmartPauses(events, getMeta);
  const nextPause = pauses.find(pause => {
    const ref = pause.before ? dateForEvent(pause.before.day, pause.before.start) : undefined;
    return ref ? ref > now : true;
  });

  const recommendations: string[] = [];
  let departureAdvice = '';

  if (current && next && route) {
    const nextStart = dateForEvent(next.day, next.start);
    const leaveIn = minutesUntil(now, nextStart) - route.walk;
    if (leaveIn <= 0) departureAdvice = `Pars maintenant vers ${next.stage}`;
    else departureAdvice = `Départ conseillé dans ${leaveIn} min vers ${next.stage}`;

    if (!route.safe) recommendations.push('Risque de retard : le trajet est plus long que la marge.');
    if (route.safe && route.margin <= route.walk + 5) recommendations.push('Marge courte : évite de traîner après le concert.');
  }

  if (nextPause && nextPause.minutes >= 60) recommendations.push(`Pause longue disponible : ${nextPause.minutes} min.`);
  if (nextPause && nextPause.minutes >= 45 && nextPause.minutes < 60) recommendations.push(`Pause possible : ${nextPause.minutes} min.`);

  return { current, next, route, departureAdvice, nextPause, recommendations };
}

export function weatherAdvice(weather: { temperature: number | null; precipitation: number | null; wind: number | null }) {
  const advice: string[] = [];
  if (weather.temperature !== null && weather.temperature >= 28) advice.push('☀️ Chaleur : eau + casquette conseillées.');
  if (weather.temperature !== null && weather.temperature <= 15) advice.push('🧥 Frais : prends une veste.');
  if (weather.precipitation !== null && weather.precipitation > 0.2) advice.push('🌧️ Pluie : prévois poncho / chaussures adaptées.');
  if (weather.wind !== null && weather.wind >= 35) advice.push('💨 Vent fort : attention aux affaires légères.');
  return advice.length ? advice : ['✅ Conditions météo OK.'];
}
