import { AlertTriangle, CalendarDays, Home, List, NotebookText, Route, Settings } from 'lucide-react';

export type TabId = 'home' | 'agenda' | 'timeline' | 'myHellfest' | 'conflicts' | 'notes' | 'settings';

export function BottomNav({ active, setActive }: { active: TabId; setActive: (tab: TabId) => void }) {
  const items = [
    ['home', <Home size={20}/>, 'Live'],
    ['agenda', <List size={20}/>, 'Agenda'],
    ['timeline', <CalendarDays size={20}/>, 'Visuel'],
    ['myHellfest', <Route size={20}/>, 'Mon HF'],
    ['conflicts', <AlertTriangle size={20}/>, 'Conflits'],
    ['notes', <NotebookText size={20}/>, 'Notes'],
    ['settings', <Settings size={20}/>, 'Plus'],
  ] as const;

  return (
    <nav className="bottomNav">
      {items.map(([id, icon, label]) => (
        <button key={id} className={active === id ? 'active' : ''} onClick={() => setActive(id)}>
          {icon}<span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
