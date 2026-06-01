import type { UserMeta, UserState } from '../lib/types';
import { STORE_KEY } from '../lib/constants';
import { useLocalStorage } from './useLocalStorage';

const EMPTY_META: UserMeta = { status: '', priority: '', criterion: '', comment: '', notify30: true, notify10: true, notifyStart: true };

export function useUserSchedule() {
  const [state, setState] = useLocalStorage<UserState>(STORE_KEY, {});

  function getMeta(id: string): UserMeta {
    return state[id] || EMPTY_META;
  }

  function updateMeta(id: string, patch: Partial<UserMeta>) {
    setState(prev => ({
      ...prev,
      [id]: { ...EMPTY_META, ...(prev[id] || {}), ...patch },
    }));
  }

  function reset() {
    setState({});
  }

  function importState(newState: UserState) {
    setState(newState || {});
  }

  return { state, setState, getMeta, updateMeta, reset, importState };
}
