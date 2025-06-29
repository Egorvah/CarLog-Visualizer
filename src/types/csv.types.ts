import type { ChartData } from './chart.types';

export type CsvDataItem = Record<string, string | number | string>
export type CsvDatasets = {
  [filename: string]: CsvDataItem[];
}
export type FileDataMode = number | null

export type fromTo = [number, number]

export type CsvPocessedData = {
  xRange: fromTo,
  data: ChartData
}