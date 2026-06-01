import * as React from 'react';
import type { UserMeta, UserState } from '../lib/types';
import { STORE_KEY } from '../lib/constants';
import { useLocalStorage } from './useLocalStorage';
import { supabase } from '../lib/supabase';

const EMPTY_META: UserMeta = {
  status: '',
  priority: '',
  criterion: '',
  comment: '',
  notify30: true,
  notify10: true,
  notifyStart: true,
};

export function useUserSchedule() {
  const [state, setState] = useLocalStorage<UserState>(STORE_KEY, {});
  const [cloudReady, setCloudReady] = React.useState(false);
  const [cloudStatus, setCloudStatus] = React.useState<'local' | 'loading' | 'saved' | 'error'>('loading');
  const saveTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function loadCloud() {
      setCloudStatus('loading');

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setCloudStatus('local');
        setCloudReady(true);
        return;
      }

      const { data, error } = await supabase
        .from('planner_data')
        .select('data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error(error);
        setCloudStatus('error');
        setCloudReady(true);
        return;
      }

      if (data?.data) {
        setState(data.data as UserState);
      }

      setCloudStatus('saved');
      setCloudReady(true);
    }

    loadCloud();

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!cloudReady) return;

    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }

    saveTimer.current = window.setTimeout(async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setCloudStatus('local');
        return;
      }

      const { error } = await supabase
        .from('planner_data')
        .upsert(
          {
            user_id: user.id,
            data: state,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error(error);
        setCloudStatus('error');
      } else {
        setCloudStatus('saved');
      }
    }, 700);

    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
      }
    };
  }, [state, cloudReady]);

  function getMeta(id: string): UserMeta {
    return state[id] || EMPTY_META;
  }

  function updateMeta(id: string, patch: Partial<UserMeta>) {
    setCloudStatus('loading');
    setState(prev => ({
      ...prev,
      [id]: { ...EMPTY_META, ...(prev[id] || {}), ...patch },
    }));
  }

  function reset() {
    setCloudStatus('loading');
    setState({});
  }

  function importState(newState: UserState) {
    setCloudStatus('loading');
    setState(newState || {});
  }

  return {
    state,
    setState,
    getMeta,
    updateMeta,
    reset,
    importState,
    cloudStatus,
  };
}