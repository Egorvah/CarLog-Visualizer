import { Dot } from 'recharts';

interface Payload {
  dataKey: string;
  stroke: string;
  xAxisId?: string;
  yAxisId?: string;
}

interface ChartComponentProps {
  data: Record<string, string | number>[];
  activeLabel: string | number;
  activePayload: Payload[];
  isTooltipActive: boolean;
  xAxisMap: Record<string, { dataKey: string; scale: (value: string | number) => number }>;
  yAxisMap: Record<string, { dataKey: string; scale: (value: string | number) => number }>;
}

export interface ChartComponent {
  props: ChartComponentProps;
}

function ChartPreviousDots(props: ChartComponentProps) {
  const { xAxisMap, yAxisMap, data, activeLabel, activePayload, isTooltipActive } = props;
  if (!activeLabel || !isTooltipActive) {
    return;
  }

  const currentTime = activeLabel;
  const dots = [];

  for (const payload of activePayload) {
    const { dataKey, stroke } = payload;
    const xAxis = xAxisMap[payload.xAxisId || '0'];
    const yAxis = yAxisMap[payload.yAxisId || '0'];

    const currentIndex = data.findIndex((item: Record<string, unknown>) => item[xAxis?.dataKey as string] === currentTime);
    if (currentIndex === -1) {
      continue;
    }

    const currentValue = data[currentIndex][dataKey];
    if (currentValue != null) {
      continue;
    }

    for (let i = currentIndex - 1; i >= 0; i--) {
      const prevTime = data[i][xAxis?.dataKey];
      const prevValue = data[i][dataKey];
      if (prevValue != null) {
        dots.push(
          <Dot
            key={ `${dataKey}-prev-dot` }
            cx={ xAxis.scale(prevTime) }
            cy={ yAxis.scale(prevValue) }
            r={ 4 }
            fill={ stroke }
            stroke="#fff"
            strokeWidth={1}
          />
        );
        break;
      }
    }
  }

  return (
    <>
      {dots}
    </>
  );
}
export default ChartPreviousDots;