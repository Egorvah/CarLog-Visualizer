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
import { Box } from '@mantine/core';
import { useInViewport } from '@mantine/hooks';
import { getDatasets } from '../utils/chart';
import customTooltip from '../utils/chartTooltipPlugin';
import useDisplay from '../hooks/useDisplay';
import type { Pid, ChartData, fromTo } from '../types';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  customTooltip,
);

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
        type: 'linear',
        min: fromTo[0],
        max: fromTo[1],
        ticks: {
          minRotation: 0,
          maxRotation: 0,
          sampleSize: 8,
        },
      },
      y: {
        type: 'linear',
        ticks: {
          minRotation: 0,
          maxRotation: 0,
          sampleSize: 6,
        },
      },
    },
  };

  const lineData: ChartJsData<'line'> = {
    datasets: lineDatasets,
  };

  return (
    <Box ref={ref} h={height}>
      {inViewport && 
        <Line options={options} data={lineData} />
      }
    </Box>
  );
}
export default Chart;