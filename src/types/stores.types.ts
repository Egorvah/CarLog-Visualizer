import type { Pid, CsvDatasets, CsvDataset } from '@/types';

export interface ChartStoreState {
  pids: Pid[],
  activePids: Pid[],
  setPids: (pids: Pid[]) => void,
  setActivePids: (activePids: Pid[]) => void,
  clearAll: () => void,
}

export interface FileStoreState {
  files: CsvDatasets,
  currentFilename: string | null,
  addFile: (filename: string, data: CsvDataset) => void
  removeFile: (filename: string) => void
}
