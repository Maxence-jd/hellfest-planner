import * as React from 'react';
import { getCurrentFestivalDay, formatClock } from '../lib/time';

export function useFestivalClock() {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return {
    now,
    label: formatClock(now),
    day: getCurrentFestivalDay(now),
  };
}
