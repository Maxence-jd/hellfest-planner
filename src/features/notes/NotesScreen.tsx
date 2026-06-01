import * as React from 'react';
import { Search } from 'lucide-react';
import type { Criterion, FestivalEvent, UserMeta } from '../../lib/types';
import { CRITERIA, PRIORITY_LABELS } from '../../lib/constants';
import { priorityClass, statusLabel } from '../../lib/priority';
import { sortByTime, stageShort } from '../../lib/events';

export function NotesScreen({
  events,
  getMeta,
  updateMeta,
  openEvent,
}: {
  events: FestivalEvent[];
  getMeta: (id: string) => UserMeta;
  updateMeta: (id: string, patch: Partial<UserMeta>) => void;
  openEvent: (event: FestivalEvent) => void;
}) {
  const [query, setQuery] = React.useState('');
  const [priority, setPriority] = React.useState('all');
  const [criterion, setCriterion] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [mode, setMode] = React.useState('notes');

  const filtered = React.useMemo(() => {
    return [...events].sort(sortByTime).filter(event => {
      const meta = getMeta(event.id);
      const text = `${event.artist} ${event.day} ${event.stage} ${meta.comment} ${meta.criterion}`.toLowerCase();
      if (query && !text.includes(query.toLowerCase())) return false;
      if (priority !== 'all' && meta.priority !== priority) return false;
      if (criterion !== 'all' && meta.criterion !== criterion) return false;
      if (status !== 'all' && meta.status !== status) return false;
      if (mode === 'notes' && !meta.comment.trim()) return false;
      if (mode === 'selected' && meta.status !== 'yes') return false;
      return true;
    });
  }, [events, getMeta, query, priority, criterion, status, mode]);

  return (
    <div className="screen notesScreen">
      <section className="notesHeader">
        <h2>Notes</h2>
        <p>Filtre et retrouve toutes tes notes, commentaires, critères et priorités.</p>
      </section>

      <section className="notesFilters">
        <label className="searchBox noteSearch"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Chercher dans les notes..." /></label>

        <div className="notesFilterGrid">
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="notes">Avec note</option>
            <option value="selected">À voir</option>
            <option value="all">Tout</option>
          </select>

          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">Tous statuts</option>
            <option value="yes">À voir</option>
            <option value="maybe">Peut-être</option>
            <option value="no">Non</option>
            <option value="">Non défini</option>
          </select>

          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="all">Toutes priorités</option>
            <option value="1">P1</option>
            <option value="2">P2</option>
            <option value="3">P3</option>
            <option value="4">P4</option>
            <option value="5">P5</option>
            <option value="">Sans priorité</option>
          </select>

          <select value={criterion} onChange={e => setCriterion(e.target.value)}>
            <option value="all">Tous critères</option>
            {CRITERIA.map(c => <option key={c} value={c}>{c || 'Sans critère'}</option>)}
          </select>
        </div>
      </section>

      <section className="notesList">
        {filtered.length === 0 && <div className="emptyState">Aucune note trouvée.</div>}

        {filtered.map(event => {
          const meta = getMeta(event.id);
          return (
            <article key={event.id} className={`noteCard ${priorityClass(meta.priority)}`}>
              <button className="noteMain" onClick={() => openEvent(event)}>
                <span>{event.day} · {event.start} → {event.end} · {stageShort(event.stage)}</span>
                <b>{event.artist}</b>
                <small>{statusLabel(meta.status)} · {PRIORITY_LABELS[meta.priority]}{meta.criterion ? ` · ${meta.criterion}` : ''}</small>
              </button>

              <textarea
                value={meta.comment}
                onChange={e => updateMeta(event.id, { comment: e.target.value })}
                placeholder="Ajouter une note..."
                rows={3}
              />

              <div className="quickNoteControls">
                <select value={meta.status} onChange={e => updateMeta(event.id, { status: e.target.value as any })}>
                  <option value="">Statut</option>
                  <option value="yes">À voir</option>
                  <option value="maybe">Peut-être</option>
                  <option value="no">Non</option>
                </select>
                <select value={meta.priority} onChange={e => updateMeta(event.id, { priority: e.target.value as any })}>
                  <option value="">Priorité</option>
                  <option value="1">P1</option>
                  <option value="2">P2</option>
                  <option value="3">P3</option>
                  <option value="4">P4</option>
                  <option value="5">P5</option>
                </select>
                <select value={meta.criterion} onChange={e => updateMeta(event.id, { criterion: e.target.value as Criterion })}>
                  {CRITERIA.map(c => <option key={c} value={c}>{c || 'Critère'}</option>)}
                </select>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
