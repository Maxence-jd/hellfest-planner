import { Flame, Search, SlidersHorizontal } from 'lucide-react';
import { DAYS, STAGES } from '../lib/constants';
import type { Filters as FilterType } from '../lib/types';

export function Filters({ filters, setFilters }: { filters: FilterType; setFilters: (patch: Partial<FilterType>) => void }) {
  return (
    <section className="filters">
      <div className="dayScroller">
        {DAYS.map(day => (
          <button key={day} className={filters.day === day ? 'active' : ''} onClick={() => setFilters({ day })}>
            {day.split(' ')[0]}<small>{day.split(' ')[1]}</small>
          </button>
        ))}
      </div>

      <div className="filterGrid">
        <label><SlidersHorizontal size={14}/><select value={filters.stage} onChange={e => setFilters({ stage: e.target.value as any })}>
          {STAGES.map(stage => <option key={stage}>{stage}</option>)}
        </select></label>

        <label><Flame size={14}/><select value={filters.mode} onChange={e => setFilters({ mode: e.target.value as any })}>
          <option value="all">Tout</option>
          <option value="selected">À voir</option>
          <option value="p1">P1 uniquement</option>
          <option value="p12">P1 + P2</option>
          <option value="maybe">Peut-être</option>
          <option value="unrated">Non notés</option>
        </select></label>
      </div>

      <label className="searchBox"><Search size={16}/><input value={filters.query} onChange={e => setFilters({ query: e.target.value })} placeholder="Chercher un groupe..." /></label>
    </section>
  );
}
