import type { UserMeta } from './types';

export function priorityClass(priority?: string): string {
  return priority ? `p${priority}` : 'p0';
}

export function score(meta: UserMeta): number {
  const base: Record<string, number> = { '1': 100, '2': 80, '3': 60, '4': 40, '5': 20, '': 0 };
  const bonus: Record<string, number> = {
    'Must-see': 5,
    'Rare': 4,
    'Découverte': 2,
    'Avec le groupe': 1,
    'Déjà vu': -2,
    'Pause possible': -5,
    'À éviter': -10,
    '': 0,
  };
  return Math.max(0, (base[meta.priority || ''] || 0) + (bonus[meta.criterion || ''] || 0));
}

export function statusLabel(status?: string): string {
  if (status === 'yes') return 'À voir';
  if (status === 'maybe') return 'Peut-être';
  if (status === 'no') return 'Non';
  return 'Non défini';
}
