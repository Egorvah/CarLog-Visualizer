import { useState, useMemo } from 'react';
import { getMode, getPidName, handleCsvData } from '../utils/csv';
import { sortPids } from '../utils/chart';
import type { CsvDatasets, CsvDataItem, FileDataMode, ChartData, Pid, fromTo } from '../types';

const useChartData = (datasets: CsvDatasets, activeDataset: string | null, activePids: Pid[]) => {
  const [chartData, setChartData] = useState<ChartData>({});
  const [xRange, setXRange] = useState<fromTo>([0, 0]);

  const isCompareMode = (): boolean => {
    return Object.keys(datasets).length > 1 && activeDataset === null;
  };

  const getActiveDataset = (): CsvDataItem[] => {
    return isCompareMode()
      ? datasets[Object.keys(datasets)[0]]
      : datasets[activeDataset ?? Object.keys(datasets)[0]];
  };

  const getPids = (mode: FileDataMode) => {
    const data = getActiveDataset();
    let pidData: string[] = [];
    if (mode === 1) {
      pidData = [...new Set(data.map((item) => getPidName(item, mode)))]
        .filter(pid => pid !== 'undefined');
    }
    if (mode === 2) {
      pidData = Object.keys(data[0]).filter(key => key !== 'time' && key !== '');
    }
    return sortPids(pidData);
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
      const data = getActiveDataset();
      const result = handleCsvData(data, addPids);
      newChartData = {...newChartData,  ...result.data};
      setXRange(result.xRange);
    }

    setChartData(newChartData);
  };

  const mode: FileDataMode = useMemo(
    () => {
      if (Object.keys(datasets).length < 1) {
        return null;
      }
      const firstDatasetKey = Object.keys(datasets)[0];
      return getMode(datasets[firstDatasetKey]);
    },
    [datasets]
  );

  const pids: Pid[] = useMemo(
    () => getPids(mode),
    [mode]
  );

  useMemo(startProcessing, [activePids]);
  
  return {
    data: chartData,
    mode,
    pids,
    xRange,
  };
};
export default useChartData;