import type { Day, Stage, Criterion } from './types';

export const DAYS: Day[] = ['Jeudi 18', 'Vendredi 19', 'Samedi 20', 'Dimanche 21'];

export const STAGES: ('Toutes' | Stage)[] = ['Toutes', 'Mainstage 1', 'Mainstage 2', 'Warzone', 'Valley', 'Temple', 'Altar'];

export const CRITERIA: Criterion[] = ['', 'Must-see', 'Rare', 'Découverte', 'Avec le groupe', 'Déjà vu', 'Pause possible', 'À éviter'];

export const PRIORITY_LABELS: Record<string, string> = {
  '1': 'P1 · IMMANQUABLE',
  '2': 'P2 · TRÈS IMPORTANT',
  '3': 'P3 · IMPORTANT',
  '4': 'P4 · SI POSSIBLE',
  '5': 'P5 · BONUS',
  '': 'PAS DE PRIORITÉ',
};

export const PRIORITY_SHORT: Record<string, string> = {
  '1': 'P1',
  '2': 'P2',
  '3': 'P3',
  '4': 'P4',
  '5': 'P5',
  '': 'P-',
};

export const STORE_KEY = 'hellfest-planner-v4-local-state';
