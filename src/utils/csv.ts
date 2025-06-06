export type CsvData = Record<string, string | number>

const ModeTypes = {
  'car_scanner_type_1': 1,
  'car_scanner_type_2': 2,
};
export type Modes = number | null

export function getMode (data: CsvData[]): Modes {
  const header: string[] = Object.keys(data[0]);
  if (header.includes('SECONDS')) {
    return ModeTypes.car_scanner_type_1
  }
  if (header.includes('time')) {
    return ModeTypes.car_scanner_type_2
  }
  return null
}

export function isValidCsv (data: CsvData[]): boolean {
  if (data.length === 0) {
    return false
  }
  return getMode(data) !== null
}