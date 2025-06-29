import { create } from 'zustand';
import type { Pid } from '../types';

interface ChartStoreState {
  pids: Pid[],
  activePids: Pid[],
  setPids: (pids: Pid[]) => void,
  setActivePids: (activePids: Pid[]) => void,
  clearAll: () => void,
}

const useChartStore = create<ChartStoreState>((set) => ({
  pids: [],
  activePids: [],

  setPids: (pids: Pid[]) => set({ pids }),
  setActivePids: (activePids: Pid[]) => set({ activePids }),
  clearAll: () => set({ pids: [], activePids: [] }),
}));

export default useChartStore;