import { Download, RotateCcw, Upload } from 'lucide-react';
import type { FestivalEvent, UserMeta, UserState } from '../../lib/types';
import { durationMinutes } from '../../lib/time';
import { totalWalkingMinutes, totalFreeMinutes, movementCount } from '../../lib/festivalMap';
import { EVENTS } from '../../data/events';

export function SettingsDashboard({
  selected,
  maybe,
  conflicts,
  getMeta,
  exportJSON,
  exportCSV,
  importJSON,
  reset,
  notificationsPermission,
  requestNotifications,
}: {
  selected: FestivalEvent[];
  maybe: FestivalEvent[];
  conflicts: [FestivalEvent, FestivalEvent][];
  getMeta: (id: string) => UserMeta;
  exportJSON: () => void;
  exportCSV: () => void;
  importJSON: (state: UserState) => void;
  reset: () => void;
  notificationsPermission: NotificationPermission;
  requestNotifications: () => void;
}) {
  const totalHours = (selected.reduce((sum, event) => sum + durationMinutes(event), 0) / 60).toFixed(1);
  const walking = totalWalkingMinutes(EVENTS, getMeta);
  const free = totalFreeMinutes(EVENTS, getMeta);
  const moves = movementCount(EVENTS, getMeta);

  function handleImport(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.state) importJSON(parsed.state);
      } catch {
        alert('Import JSON invalide');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="screen settingsScreen">
      <section className="statsGrid">
        <div><b>{selected.length}</b><span>À voir</span></div>
        <div><b>{maybe.length}</b><span>Peut-être</span></div>
        <div><b>{conflicts.length}</b><span>Conflits</span></div>
        <div><b>{totalHours}h</b><span>Concerts</span></div>
        <div><b>{walking}m</b><span>Marche</span></div>
        <div><b>{moves}</b><span>Changements</span></div>
        <div><b>{Math.round(free/60*10)/10}h</b><span>Pauses</span></div>
      </section>

      <section className="panel">
        <h2>Priorités</h2>
        {[1,2,3,4,5].map(priority => (
          <div key={priority} className={`legendRow p${priority}`}>
            <b>P{priority}</b>
            <span>{selected.filter(event => getMeta(event.id).priority === String(priority)).length} sélectionné(s)</span>
          </div>
        ))}
      </section>

      <section className="dataActions">
        <button onClick={requestNotifications}>Notifications : {notificationsPermission}</button>
        <button onClick={exportJSON}><Download size={18}/> Export JSON</button>
        <button onClick={exportCSV}><Download size={18}/> Export CSV</button>
        <label><Upload size={18}/> Import JSON<input type="file" accept=".json" onChange={e => handleImport(e.target.files?.[0])}/></label>
        <button className="danger" onClick={reset}><RotateCcw size={18}/> Reset local</button>
      </section>
    </div>
  );
}
