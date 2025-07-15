import { create } from 'zustand';
import type { FileStoreState } from '@/types';

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