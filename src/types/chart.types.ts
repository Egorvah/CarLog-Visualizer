import type { Chart, ChartEvent, Color, Point } from 'chart.js';

export type PidData = Point[];
export type Pid = string;

export type ChartData = {
  [pid: string]: PidData;
};

export type NearestPoint = {
  label: string | undefined,
  x: number,
  y: number,
  color: Color,
  backgroundColor: Color,
};

export type CustomTooltip = {
  active: boolean,
  freeze: boolean,
  x: number,
  y: number,
  xAxisPos: number,
  yAxisPos: number,
};

export type ChartWithTooltip = Chart & {
  _customTooltipSubscription: () => void | null,
};

export type ChartEventArgs = {
  event: ChartEvent, 
  inChartArea: boolean,
}