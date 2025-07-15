import { LTTB } from 'downsample';
import type { ChartDataset, Point } from 'chart.js';
import type { Pid, ChartData, fromTo, NearestPoint } from '@/types';

export const colors = [
  '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
  '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E',
  '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC',
  '#E67300', '#8B0707', '#329262', '#5574A6', '#B77322', 
  '#16D620', '#B91383', '#F4359E', '#9C5935', '#A9C413',
  '#2A778D', '#668D1C', '#BEA413', '#0C5922', '#743411',
  '#D6A4A4', '#A4D6D6', '#D6D6A4', '#A4A4D6', '#D6A4D6',
  '#A4D6A4', '#D6A4A4', '#A4D6D6', '#D6D6A4', '#A4A4D6'
] as const;

export const getColorByLabel = (label: string): string => {
  const hash = Array.from(label).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const sortPids = (pids: Pid[]): string[] => {
  return pids.sort((a, b) => a.localeCompare(b));
};

export const sortNearestPoints = (data: NearestPoint[]): NearestPoint[] => {
  const key: keyof NearestPoint = 'label';
  return data.sort((a, b) => String(a[key]).localeCompare(String(b[key])));
};

export const getDatasets = (data: ChartData, fromTo: fromTo, pids: Pid[], chartMaxDots: number): ChartDataset<'line'>[] => {
    const min = fromTo?.[0];
    const max = fromTo?.[1];
    const datasets: ChartDataset<'line'>[] = [];

    pids.forEach((pid: Pid) => {
      let pidData: Point[] = [];
      if (min != null && max != null) {
        const minIndex = data?.[pid]?.findIndex((item: Point) => item.x >= min) || 0;
        let maxIndex = data?.[pid]?.slice(minIndex)?.findIndex((item: Point) => item.x >= max);
        if (maxIndex === -1) {
          maxIndex = data?.[pid]?.length - 1;
        } else {
          maxIndex += minIndex;
        }

        if (minIndex !== -1 && maxIndex !== -1) {
          pidData = data?.[pid]?.slice(minIndex, maxIndex + 1);
        }
      } else {
        pidData = data?.[pid];
      }

      if (pidData?.length > 0) {
        const sampledData: Point[] = LTTB(pidData, chartMaxDots) as Point[];
        datasets.push({
          type: 'line',
          label: pid,
          data: sampledData || [],
          borderColor: getColorByLabel(pid),
          backgroundColor: getColorByLabel(pid),
          pointHoverRadius: 4,
          spanGaps: true,
          pointRadius: 0,
          parsing: false,
        });
      }
    });

    return datasets;
  };