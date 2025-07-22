import { useState, useMemo } from 'react';
import { sortPids } from '@/utils/chart';
import type { CsvDatasets, CsvDataset, ChartData, Pid, fromTo } from '@/types';

const useChartData = (datasets: CsvDatasets, activePids: Pid[]) => {
  const [chartData, setChartData] = useState<ChartData>({});
  const [xRange, setXRange] = useState<fromTo>([0, 0]);

  const getActiveDataset = (datasets: CsvDatasets): CsvDataset => {
    return datasets[Object.keys(datasets)[0]];
  };

  const getPids = (datasets: CsvDatasets) => {
    const dataset = getActiveDataset(datasets);
    return sortPids(dataset?.getPids() || []);
  };

  const startProcessing = (datasets: CsvDatasets) => {
    if (activePids.length < 1 && chartData.length) {
      setChartData({});
    }

    const chartDataPids = Object.keys(chartData);
    const addPids = activePids.filter(pid => !chartDataPids.includes(pid));
    const removedPids = chartDataPids.filter(pid => !activePids.includes(pid));
    if (!removedPids.length && !addPids.length) {
      return;
    }

    let newChartData = {...chartData};
    if (removedPids.length) {
      removedPids.forEach((pid) => {
        delete newChartData[pid];
      });
    }

    if (addPids.length) {
      const dataset = getActiveDataset(datasets);
      const result = dataset.getChartData(addPids);
      newChartData = {...newChartData,  ...result.data};
      setXRange(result.xRange);
    }

    setChartData(newChartData);
  };

  const pids: Pid[] = useMemo(
    () => getPids(datasets),
    [datasets]
  );

  startProcessing(datasets);
  
  return {
    data: chartData,
    pids,
    xRange,
  };
};
export default useChartData;