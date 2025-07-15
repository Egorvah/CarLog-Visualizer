import type { ChartData, Pid } from '@/types/chart.types';

export type CsvDataItem = string[]
export type CsvData = CsvDataItem[]

export type fromTo = [number, number]

export type CsvPocessedData = {
  xRange: fromTo,
  data: ChartData
}

export interface CsvDataset {
  isValidData: () => boolean
  getPids: () => Pid[]
  getChartData: (pids: Pid[]) => CsvPocessedData
}

export type CsvDatasets = {
  [filename: string]: CsvDataset;
}

export type ColumnNames = Record<string, string>
export type Columns = Record<string, number>