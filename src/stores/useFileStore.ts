import { create } from 'zustand';
import type { CsvDataItem, CsvDatasets } from '../types';

interface FileStoreState {
  files: CsvDatasets,
  currentFilename: string | null,
  addFile: (filename: string, data: CsvDataItem[]) => void
  removeFile: (filename: string) => void
}

const useFileStore = create<FileStoreState>((set) => ({
  files: {},
  currentFilename: null,

  addFile: (filename, data) => set(
    (state) => ({ 
      files: {
        ...state.files,
        [filename]: data
      },
      currentFilename: filename,
    })
  ),
  removeFile: (filename: string) => set(
    (state) => {
      const newFiles = { ...state.files };
      delete newFiles[filename];
      return {
        files: newFiles,
        currentFilename: state.currentFilename === filename ? null : state.currentFilename,
      };
    }
  ),
}));

export default useFileStore;