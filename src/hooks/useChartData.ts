import { useState, useMemo } from 'react';
import { sortPids } from '@/utils/chart';
import type { CsvDatasets, CsvDataset, ChartData, Pid, fromTo } from '@/types';

const useChartData = (datasets: CsvDatasets, activeDataset: string | null, activePids: Pid[]) => {
  const [chartData, setChartData] = useState<ChartData>({});
  const [xRange, setXRange] = useState<fromTo>([0, 0]);

  const isCompareMode = (): boolean => {
    return Object.keys(datasets).length > 1 && activeDataset === null;
  };

  const getActiveDataset = (): CsvDataset => {
    return isCompareMode()
      ? datasets[Object.keys(datasets)[0]]
      : datasets[activeDataset ?? Object.keys(datasets)[0]];
  };

  const getPids = () => {
    const dataset = getActiveDataset();
    return sortPids(dataset?.getPids() || []);
  };

  const startProcessing = () => {
    if (activePids.length < 1) {
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
      const dataset = getActiveDataset();
      const result = dataset.getChartData(addPids);
      newChartData = {...newChartData,  ...result.data};
      setXRange(result.xRange);
    }

    setChartData(newChartData);
  };

  const pids: Pid[] = useMemo(
    () => getPids(),
    [datasets]
  );

  useMemo(startProcessing, [activePids]);
  
  return {
    data: chartData,
    pids,
    xRange,
  };
};
export default useChartData;