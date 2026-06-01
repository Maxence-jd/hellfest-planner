import * as React from 'react';
import type { FestivalEvent, UserMeta } from '../lib/types';
import { dateForEvent, minutesUntil } from '../lib/time';

export function useNotifications(
  events: FestivalEvent[],
  getMeta: (id: string) => UserMeta,
  now: Date
) {
  const [permission, setPermission] = React.useState<NotificationPermission>(
    typeof Notification === 'undefined' ? 'denied' : Notification.permission
  );

  async function requestPermission() {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  React.useEffect(() => {
    if (typeof Notification === 'undefined') return;
    if (permission !== 'granted') return;

    const selected = events.filter(event => getMeta(event.id).status === 'yes');

    selected.forEach(event => {
      const meta = getMeta(event.id);
      const start = dateForEvent(event.day, event.start);
      const mins = minutesUntil(now, start);
      const keyBase = `notify-${event.id}-${event.day}-${event.start}`;

      const notify = (suffix: string, title: string, body: string) => {
        const key = `${keyBase}-${suffix}`;
        if (localStorage.getItem(key)) return;

        new Notification(title, {
          body,
          icon: '/logo-fr.png',
          badge: '/logo-fr.png',
          tag: key,
          
        });

        localStorage.setItem(key, '1');
      };

      if (meta.notify30 && mins <= 30 && mins > 20) {
        notify('30', `${event.artist} dans 30 min`, `${event.stage} · ${event.start}`);
      }

      if (meta.notify10 && mins <= 10 && mins > 3) {
        notify('10', `${event.artist} dans 10 min`, `${event.stage} · prépare-toi`);
      }

      if (meta.notifyStart && mins <= 0 && mins > -5) {
        notify('start', `${event.artist} commence`, `${event.stage} · maintenant`);
      }
    });
  }, [permission, events, getMeta, now]);

  return { permission, requestPermission };
}