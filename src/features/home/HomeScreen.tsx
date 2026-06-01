import { Clock, CloudSun, Navigation, Radio, Utensils, Footprints, Sparkles } from 'lucide-react';
import type { FestivalEvent, UserMeta } from '../../lib/types';
import { dateForEvent, minutesUntil } from '../../lib/time';
import { priorityClass } from '../../lib/priority';
import { PRIORITY_LABELS } from '../../lib/constants';
import { sortByPriorityThenTime } from '../../lib/events';
import type { WeatherInfo } from '../../hooks/useWeather';
import { buildDayAssistant, weatherAdvice } from '../../lib/assistant';

export function HomeScreen({
  now,
  day,
  events,
  selected,
  getMeta,
  openEvent,
  goTimelineNow,
  weather,
}: {
  now: Date;
  day: string;
  events: FestivalEvent[];
  selected: FestivalEvent[];
  getMeta: (id: string) => UserMeta;
  openEvent: (event: FestivalEvent) => void;
  goTimelineNow: () => void;
  weather: WeatherInfo;
}) {
  const assistant = buildDayAssistant(selected, getMeta, now);
  const topToday = events.filter(event => event.day === day).sort(sortByPriorityThenTime(getMeta)).slice(0, 5);
  const advices = [...assistant.recommendations, ...weatherAdvice(weather)].slice(0, 4);

  return (
    <div className="screen">
      <section className="liveHero v6Hero">
        <img src="/logo-fr.png" alt="Hellfest" className="heroLogo" />
        <div>
          <span className="eyebrow"><Radio size={13}/> Assistant live</span>
          <h1>{day}</h1>
          <p><Clock size={15}/> {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <button onClick={goTimelineNow}><Navigation size={17}/> Maintenant</button>
      </section>

      <section className="assistantCard">
        <h2><Sparkles size={19}/> Assistant de journée</h2>
        <div className="assistantGrid">
          <LiveBlock title="En cours" event={assistant.current} now={now} getMeta={getMeta} openEvent={openEvent} />
          <LiveBlock title="Prochain" event={assistant.next} now={now} getMeta={getMeta} openEvent={openEvent} />
        </div>

        {assistant.route && (
          <div className={`departureBox ${assistant.route.safe ? 'safe' : 'risk'}`}>
            <Footprints size={19}/>
            <div>
              <b>{assistant.departureAdvice}</b>
              <span>{assistant.route.from} → {assistant.route.to} · marche {assistant.route.walk} min · marge {assistant.route.margin} min</span>
            </div>
          </div>
        )}

        <div className="adviceList">
          {advices.map((advice, index) => <span key={index}>{advice}</span>)}
        </div>
      </section>

      <section className="miniInfoGrid">
        <div className="miniInfo"><CloudSun size={18}/><b>{weather.temperature === null ? 'Météo' : `${Math.round(weather.temperature)}°C`}</b><span>{weather.label}</span></div>
        <div className="miniInfo"><Utensils size={18}/><b>{assistant.nextPause ? `${assistant.nextPause.minutes} min` : '—'}</b><span>{assistant.nextPause ? `Pause ${assistant.nextPause.start}` : 'Pas de pause longue'}</span></div>
      </section>

      <section className="panel">
        <h2>Priorités du jour</h2>
        <div className="compactList">
          {topToday.map(event => {
            const meta = getMeta(event.id);
            return (
              <button key={event.id} className={`compactItem ${priorityClass(meta.priority)}`} onClick={() => openEvent(event)}>
                <span>{event.start}<small>{event.end}</small></span>
                <b>{event.artist}<small>{event.stage} · {PRIORITY_LABELS[meta.priority]}</small></b>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function LiveBlock({
  title,
  event,
  now,
  getMeta,
  openEvent,
}: {
  title: string;
  event?: FestivalEvent;
  now: Date;
  getMeta: (id: string) => UserMeta;
  openEvent: (event: FestivalEvent) => void;
}) {
  if (!event) return <div className="liveBlock"><b>{title}</b><span>Aucun concert sélectionné</span></div>;

  const meta = getMeta(event.id);
  const start = dateForEvent(event.day, event.start);
  const end = dateForEvent(event.day, event.end);
  const live = now >= start && now <= end;
  const minutes = live ? minutesUntil(now, end) : minutesUntil(now, start);

  return (
    <button className={`liveBlock ${priorityClass(meta.priority)}`} onClick={() => openEvent(event)}>
      <b>{title}</b>
      <strong>{event.artist}</strong>
      <span>{live ? `reste ${minutes} min` : `dans ${minutes} min`} · {event.stage}</span>
    </button>
  );
}
