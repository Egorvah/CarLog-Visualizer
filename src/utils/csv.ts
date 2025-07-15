import type { CsvData, CsvDataset } from '@/types';

import CarScannerType1 from '@/utils/csv/CarScannerType1';
import CarScannerType2 from '@/utils/csv/CarScannerType2';
import Vsdc from '@/utils/csv/Vsdc';

const fileTypes = [
  CarScannerType1,
  CarScannerType2,
  Vsdc,
];

export const getFileType = (data: CsvData): (CsvDataset | null) => {
  for (const FileType of fileTypes) {
    const fType = new FileType(data);
    if (fType.isValidData()) {
      return fType;
    }
  }
  return null;
};
