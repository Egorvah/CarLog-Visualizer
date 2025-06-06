import { useState, useEffect } from 'react'
import { getMode } from '../utils/csv'
import { sortPids } from '../utils/chart'
import type { CsvData, Modes } from '../utils/csv'

type ChartDataItem = {
  time: number | string;
  prevState: Record<string, number>;
  [pid: string]: number | string | Record<string, number>;
};

const useChartData = (data: CsvData[], activePids: string[]) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [mode, setMode] = useState<Modes>(null);
  const [pids, setPids] = useState<string[]>([])
  
  useEffect(() => {
    if (data.length > 0) {
      const currentMode = getMode(data);
      setMode(currentMode);

      if (currentMode === 1) {
        processingMode1(data, activePids);
      } 
      else if (currentMode === 2) {
        processingMode2(data, activePids);
      }
    }
  }, [data, activePids]); // eslint-disable-line react-hooks/exhaustive-deps


  const getPidName = (data: CsvData): string => {
    if (mode === 1) {
      return data?.UNITS 
        ? String(`${ data.PID } (${ data.UNITS })`)
        : String(data.PID);
    }
    return '';
  }

  const processingMode1 = (data: CsvData[], activePids: string[]) => {
    const pidData = sortPids([...new Set(data.map(getPidName))].filter(pid => pid !== 'undefined'));
    setPids(pidData);

    if (activePids.length === 0) {
      setChartData([]);
      return;
    }

    const startSecond = Number(data[0].SECONDS);
    const chartDataGroupedBySeconds = data
      .filter((item: Record<string, string | number>) => activePids.includes(getPidName(item)))
      .reduce<Record<string, CsvData[]>>((acc, item) => {
        const key = (Number(item.SECONDS) - startSecond).toFixed(3);
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});

    if (Object.keys(chartDataGroupedBySeconds).length === 0) {
      return;
    }

    const prevState: Record<string, number> = {}
    const chartItems = Object.values(chartDataGroupedBySeconds).
      map((groupData) => {
        const chartItem: ChartDataItem = {
          time: Number(Number(Number(groupData[0].SECONDS) - startSecond).toFixed(3)),
          prevState: { ...prevState },
        };

        groupData.forEach(pidData => {
          const value = Number(pidData.VALUE);
          chartItem[getPidName(pidData)] = value;
          prevState[getPidName(pidData)] = value;
        });

        return chartItem;
      })
      setChartData(chartItems)
  }

  const processingMode2 = (data: CsvData[], activePids: string[]) => {
    const pidData = sortPids(Object.keys(data[0]).filter(key => key !== 'time' && key != ''));
    setPids(pidData);

    if (activePids.length === 0) {
      setChartData([]);
      return;
    }

    const prevState: Record<string, number> = {};
    const chartItems = data.map(item => {
      const chartItem: ChartDataItem = {
        time: String(item.time),
        prevState: { ...prevState },
      };

      activePids.forEach(pid => {
        if (item[pid] !== '') {
          const value = Number(item[pid]);
          chartItem[pid] = value;
          prevState[pid] = value;
        }
      });

      // If no active PIDs data, skip this item
      if (Object.keys(chartItem).length === 2) {
        return null;
      }

      return chartItem;
    }).filter(item => item !== null);

    setChartData(chartItems);
  }
  
  return {
    data: chartData,
    mode,
    pids,
  };
}
export default useChartData;