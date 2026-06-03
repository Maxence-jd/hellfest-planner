import { Flame, Search, SlidersHorizontal } from 'lucide-react';
import { DAYS, STAGES } from '../lib/constants';
import type { Filters as FilterType, Priority, Stage, Status } from '../lib/types';

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'yes', label: 'À voir' },
  { value: 'maybe', label: 'Peut-être' },
  { value: '', label: 'Sans statut' },
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: '1', label: 'P1' },
  { value: '2', label: 'P2' },
  { value: '3', label: 'P3' },
  { value: '4', label: 'P4' },
  { value: '5', label: 'P5' },
  { value: '', label: 'Sans priorité' },
];

function toggle<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter(item => item !== value)
    : [...list, value];
}

export function Filters({
  filters,
  setFilters,
}: {
  filters: FilterType;
  setFilters: (patch: Partial<FilterType>) => void;
}) {
  const allStagesSelected = filters.stages.length === 0;
  const allStatusesSelected = filters.statuses.length === 0;
  const allPrioritiesSelected = filters.priorities.length === 0;

  return (
    <section className="filters">
      <div className="dayScroller">
        {DAYS.map(day => (
          <button
            key={day}
            className={filters.day === day ? 'active' : ''}
            onClick={() => setFilters({ day })}
          >
            {day.split(' ')[0]}<small>{day.split(' ')[1]}</small>
          </button>
        ))}
      </div>

      <div className="multiFilterBlock">
        <div className="multiFilterTitle">
          <SlidersHorizontal size={14} />
          Scènes
          <button onClick={() => setFilters({ stages: [] })}>
            {allStagesSelected ? 'Toutes' : 'Réinitialiser'}
          </button>
        </div>

        <div className="chipGrid">
          {STAGES.filter(stage => stage !== 'Toutes').map(stage => (
            <button
              key={stage}
              className={filters.stages.includes(stage as Stage) ? 'chip active' : 'chip'}
              onClick={() => setFilters({ stages: toggle(filters.stages, stage as Stage) })}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      <div className="multiFilterBlock">
        <div className="multiFilterTitle">
          <Flame size={14} />
          Statuts
          <button onClick={() => setFilters({ statuses: [] })}>
            {allStatusesSelected ? 'Tous' : 'Réinitialiser'}
          </button>
        </div>

        <div className="chipGrid">
          {STATUS_OPTIONS.map(option => (
            <button
              key={option.label}
              className={filters.statuses.includes(option.value) ? 'chip active' : 'chip'}
              onClick={() => setFilters({ statuses: toggle(filters.statuses, option.value) })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="multiFilterBlock">
        <div className="multiFilterTitle">
          <Flame size={14} />
          Priorités
          <button onClick={() => setFilters({ priorities: [] })}>
            {allPrioritiesSelected ? 'Toutes' : 'Réinitialiser'}
          </button>
        </div>

        <div className="chipGrid priorityChips">
          {PRIORITY_OPTIONS.map(option => (
            <button
              key={option.label}
              className={filters.priorities.includes(option.value) ? 'chip active' : 'chip'}
              onClick={() => setFilters({ priorities: toggle(filters.priorities, option.value) })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <label className="searchBox">
        <Search size={16} />
        <input
          value={filters.query}
          onChange={e => setFilters({ query: e.target.value })}
          placeholder="Chercher un groupe..."
        />
      </label>
    </section>
  );
}