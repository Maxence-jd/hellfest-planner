export type Day = 'Jeudi 18' | 'Vendredi 19' | 'Samedi 20' | 'Dimanche 21';
export type Stage = 'Mainstage 1' | 'Mainstage 2' | 'Warzone' | 'Valley' | 'Temple' | 'Altar';
export type Status = '' | 'yes' | 'maybe' | 'no';
export type Priority = '' | '1' | '2' | '3' | '4' | '5';
export type Criterion = '' | 'Must-see' | 'Rare' | 'Découverte' | 'Avec le groupe' | 'Déjà vu' | 'Pause possible' | 'À éviter';

export type FestivalEvent = {
  id: string;
  day: Day;
  stage: Stage;
  start: string;
  end: string;
  artist: string;
};

export type UserMeta = {
  status: Status;
  priority: Priority;
  criterion: Criterion;
  comment: string;
  notify30?: boolean;
  notify10?: boolean;
  notifyStart?: boolean;
};

export type UserState = Record<string, UserMeta>;

export type Filters = {
  day: Day;
  stage: 'Toutes' | Stage;
  mode: 'all' | 'selected' | 'maybe' | 'p1' | 'p12' | 'unrated';
  query: string;
};
