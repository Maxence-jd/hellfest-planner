import { Settings } from 'lucide-react';
import type { TabId } from './BottomNav';

export function TopBar({ subtitle, setTab }: { subtitle: string; setTab: (tab: TabId) => void }) {
  return (
    <header className="topBar">
      <div className="brand">
        <img src="/logo-fr.png" alt="Hellfest Tales From The Pit 2026" className="hellfestLogo" />
        <div>
          <b>Planner V6</b>
          <span>{subtitle}</span>
        </div>
      </div>
      <button className="iconButton" onClick={() => setTab('settings')} aria-label="Réglages"><Settings size={20}/></button>
    </header>
  );
}
