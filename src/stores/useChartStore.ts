import { create } from 'zustand';
import type { ChartStoreState, Pid } from '@/types';

const useChartStore = create<ChartStoreState>((set) => ({
  pids: [],
  activePids: [],

  setPids: (pids: Pid[]) => set({ pids }),
  setActivePids: (activePids: Pid[]) => set({ activePids }),
  clearAll: () => set({ pids: [], activePids: [] }),
}));

export default useChartStore;