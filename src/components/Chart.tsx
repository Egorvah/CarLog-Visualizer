import { useMemo } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import type { ChartOptions, ChartData as ChartJsData, ChartDataset } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Loader } from '@mantine/core';
import { useInViewport } from '@mantine/hooks';
import { getDatasets } from '@/utils/chart';
import customTooltip from '@/utils/chartTooltipPlugin';
import useDisplay from '@/hooks/useDisplay';
import type { Pid, ChartData, fromTo } from '@/types';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  customTooltip,
);

const chartColors = {
  axis: '#B0B0B0',
  axisText: '#333333',
  grid: '#E8E8E8',
};

const axisConfig = {
  type: 'linear',
  ticks: {
    minRotation: 0,
    maxRotation: 0,
    sampleSize: 8,
    color: chartColors.axisText,
  },
  grid: {
    color: chartColors.grid,
    tickColor: chartColors.axis,
  },
  border: {
    color: chartColors.axis,
  },
} as const;

interface ComponentProps {
  chartData: ChartData,
  fromTo: fromTo,
  pids: Pid[],
  height: number | undefined,
}

function Chart({ chartData, fromTo, pids, height }: ComponentProps) {
  const { ref, inViewport } = useInViewport();
  const { viewport } = useDisplay();

  const chartMaxDots = viewport.width / 1.5;
  const lineDatasets: ChartDataset<'line'>[] = useMemo(
    () => getDatasets(chartData, fromTo, pids, chartMaxDots),
    [chartData, fromTo, pids, chartMaxDots]
  );

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    parsing: false,
    scales: {
      x: {
        ...axisConfig,
        min: fromTo[0],
        max: fromTo[1],
      },
      y: axisConfig,
    },
  };

  const lineData: ChartJsData<'line'> = {
    datasets: lineDatasets,
  };

  return (
    <Box ref={ ref } h={ height }>
      {inViewport && 
        <Line options={ options } data={ lineData } fallbackContent={ <Loader /> }/>
      }
    </Box>
  );
}
export default Chart;