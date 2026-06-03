import * as React from 'react';
import { EVENTS } from '../data/events';
import { BottomNav, type TabId } from '../components/BottomNav';
import { EventSheet } from '../components/EventSheet';
import { Filters } from '../components/Filters';
import { TopBar } from '../components/TopBar';
import { Footer } from '../components/Footer';
import { AgendaScreen } from '../features/agenda/AgendaScreen';
import { ConflictsScreen } from '../features/conflicts/ConflictsScreen';
import { SettingsDashboard } from '../features/dashboard/SettingsDashboard';
import { HomeScreen } from '../features/home/HomeScreen';
import { MyHellfestScreen } from '../features/myHellfest/MyHellfestScreen';
import { NotesScreen } from '../features/notes/NotesScreen';
import { TimelineScreen } from '../features/timeline/TimelineScreen';
import { useFestivalClock } from '../hooks/useFestivalClock';
import { useNotifications } from '../hooks/useNotifications';
import { useUserSchedule } from '../hooks/useUserSchedule';
import { useWeather } from '../hooks/useWeather';
import { DAYS } from '../lib/constants';
import { findConflicts } from '../lib/events';
import type { FestivalEvent, Filters as FilterType } from '../lib/types';

export function App() {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    const onUpdate = () => setUpdateAvailable(true);

    window.addEventListener('app-update-available', onUpdate);

    return () => {
      window.removeEventListener('app-update-available', onUpdate);
    };
  }, []);

  const [tab, setTab] = React.useState<TabId>('home');


  const clock = useFestivalClock();


 const [filters, setFiltersState] = React.useState<FilterType>({
  day: clock.day,
  stages: [],
  statuses: [],
  priorities: [],
  query: '',
});


  const [activeEvent, setActiveEvent] = React.useState<FestivalEvent | null>(null);
  const [timelineSignal, setTimelineSignal] = React.useState(0);
  const weather = useWeather();
  const { state, getMeta, updateMeta, reset, importState } = useUserSchedule();

  React.useEffect(() => {
    setFiltersState(prev => ({ ...prev, day: clock.day }));
  }, []);

  const selected = React.useMemo(() => EVENTS.filter(event => getMeta(event.id).status === 'yes'), [state]);
  const maybe = React.useMemo(() => EVENTS.filter(event => getMeta(event.id).status === 'maybe'), [state]);
  const conflicts = React.useMemo(() => findConflicts(selected), [selected]);
  const conflictIds = React.useMemo(() => {
    const ids = new Set<string>();
    conflicts.forEach(([a, b]) => { ids.add(a.id); ids.add(b.id); });
    return ids;
  }, [conflicts]);

  const { permission, requestPermission } = useNotifications(EVENTS, getMeta, clock.now);

  const visibleEvents = React.useMemo(() => {
    return EVENTS.filter(event => {
      const meta = getMeta(event.id);
      if (event.day !== filters.day) return false;
     if (filters.stages.length > 0 && !filters.stages.includes(event.stage)) return false;
if (filters.statuses.length > 0 && !filters.statuses.includes(meta.status)) return false;
if (filters.priorities.length > 0 && !filters.priorities.includes(meta.priority)) return false;
if (filters.query && !event.artist.toLowerCase().includes(filters.query.toLowerCase())) return false;


    }).sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.start.localeCompare(b.start));
  }, [filters, state]);

  function patchFilters(patch: Partial<FilterType>) {
    setFiltersState(prev => ({ ...prev, ...patch }));
  }

  function openEvent(event: FestivalEvent) {
    setActiveEvent(event);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ state, events: EVENTS }, null, 2)], { type: 'application/json' });
    download(blob, 'hellfest-planner-v4-selection.json');
  }

  function exportCSV() {
    const rows = [['Jour','Scene','Debut','Fin','Artiste','Statut','Priorite','Critere','Commentaire']];
    EVENTS.forEach(event => {
      const meta = getMeta(event.id);
      rows.push([event.day, event.stage, event.start, event.end, event.artist, meta.status, meta.priority, meta.criterion, meta.comment]);
    });
   const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');

download(
  new Blob([csv], { type: 'text/csv;charset=utf-8' }),
  'hellfest-planner-v4-selection.csv'
);
}
  function download(blob: Blob, filename: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function goTimelineNow() {
    setTab('timeline');
    patchFilters({ day: clock.day });
    setTimelineSignal(value => value + 1);
  }

  return (
    <div className="appShell">
      <TopBar subtitle={`${filters.day} · ${visibleEvents.length} concerts`} setTab={setTab} />
      <Filters filters={filters} setFilters={patchFilters} />

      <main className="appContent">
        {tab === 'home' && (
          <HomeScreen
            now={clock.now}
            day={filters.day}
            events={visibleEvents}
            selected={selected}
            getMeta={getMeta}
            openEvent={openEvent}
            goTimelineNow={goTimelineNow}
            weather={weather}
          />
        )}

        {tab === 'agenda' && (
          <AgendaScreen
            events={visibleEvents}
            getMeta={getMeta}
            updateMeta={updateMeta}
            openEvent={openEvent}
            conflictIds={conflictIds}
          />
        )}

        {tab === 'timeline' && (
          <TimelineScreen
            events={visibleEvents}
            day={filters.day}
            now={clock.now}
            getMeta={getMeta}
            openEvent={openEvent}
            conflictIds={conflictIds}
            scrollToNowSignal={timelineSignal}
          />
        )}

        {tab === 'myHellfest' && (
          <MyHellfestScreen selected={selected} getMeta={getMeta} openEvent={openEvent} conflictCount={conflicts.length} />
        )}

        {tab === 'conflicts' && <ConflictsScreen conflicts={conflicts} getMeta={getMeta} openEvent={openEvent} />}


        {tab === 'notes' && (
          <NotesScreen
            events={EVENTS}
            getMeta={getMeta}
            updateMeta={updateMeta}
            openEvent={openEvent}
          />
        )}

        {tab === 'settings' && (
          <SettingsDashboard
            selected={selected}
            maybe={maybe}
            conflicts={conflicts}
            getMeta={getMeta}
            exportJSON={exportJSON}
            exportCSV={exportCSV}
            importJSON={importState}
            reset={reset}
            notificationsPermission={permission}
            requestNotifications={requestPermission}
          />
        )}
      </main>

      <Footer />

{updateAvailable && (
  <button
    className="updateBanner"
    onClick={() => window.location.reload()}
  >
    Nouvelle version disponible — Mettre à jour
  </button>
)}

<BottomNav active={tab} setActive={setTab} />
      
      {activeEvent && (
        <EventSheet
          event={activeEvent}
          meta={getMeta(activeEvent.id)}
          updateMeta={updateMeta}
          close={() => setActiveEvent(null)}
        />
      )}
    </div>
  );
}
