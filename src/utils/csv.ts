import type { CsvDataItem, CsvPocessedData, Pid, FileDataMode, ChartData } from '../types';

const ModeTypes = {
  'car_scanner_type_1': 1,
  'car_scanner_type_2': 2,
};

export const getMode = (data: CsvDataItem[]): FileDataMode => {
  const header: string[] = Object.keys(data[0]);
  if (header.includes('SECONDS')) {
    return ModeTypes.car_scanner_type_1;
  }
  // if (header.includes('time')) {
  //   return ModeTypes.car_scanner_type_2;
  // }
  return null;
};

export const isValidCsv = (data: CsvDataItem[]): boolean => {
  if (data.length === 0) {
    return false;
  }
  return getMode(data) !== null;
};

export const getPidName = (data: CsvDataItem, mode: FileDataMode): string => {
  if (mode === 1) {
    return data?.UNITS 
      ? String(`${ data.PID } (${ data.UNITS })`)
      : String(data.PID);
  }
  return '';
};

const processingMode1 = (data: CsvDataItem[], pids: Pid[]): CsvPocessedData => {
  const startSecond = Number(data[0].SECONDS);
  const activeData = data
    .filter((item: Record<string, string | number>) => pids.includes(getPidName(item, ModeTypes.car_scanner_type_1)));

  if (Object.keys(activeData).length === 0) {
    return {
      xRange: [0,0],
      data: {},
    };
  }

  const chartItems: ChartData = {};
  let maxX = 0;
  let minX = Number.MAX_SAFE_INTEGER;

  Object.entries(activeData).forEach(([_key, pidData]) => {
    const time = Number(Number(Number(pidData.SECONDS) - startSecond).toFixed(3));
    const pidName = getPidName(pidData, ModeTypes.car_scanner_type_1);
    const value = Number(pidData.VALUE);
    
    if (chartItems[pidName] == null) {
      chartItems[pidName] = [];
    }

    chartItems[pidName].push({
      x: time,
      y: value,
    });

    if (time > maxX) {
      maxX = time;
    }
    if (time < minX) {
      minX = time;
    }
  });

  // sort coordinates by x
  Object.entries(chartItems).forEach(([pidName, items]) => {
    chartItems[pidName] = items.sort((a, b) => a.x - b.x);
  });

  return {
    xRange: [minX, maxX],
    data: chartItems,
  };
};

const processingMode2 = (data: CsvDataItem[], pids: Pid[]): CsvPocessedData => {
  const chartItems: ChartData = {};
  let maxX = 0;
  let minX = Number.MAX_SAFE_INTEGER;
  const timeKey = 'time';

  const getSeconds = (item: CsvDataItem) => {
    const time = item?.[timeKey] as string;
    return Number(time.replaceAll(':', ''));
  };

  const startSecond = getSeconds(data[0]);

  for (const dataIndex in data) {
    const item = data[dataIndex];
    if (item?.[timeKey] == null || item[timeKey] === '') {
      continue;
    }

    const time = Number(Number(getSeconds(item) - startSecond).toFixed(3));

    pids.forEach(pidName => {
      if (item?.[pidName] === '' || item?.[pidName] === undefined) {
        return;
      }

      if (chartItems[pidName] == null) {
        chartItems[pidName] = [];
      }

      chartItems[pidName].push({
        x: time,
        y: Number(item?.[pidName]),
      });

      if (time > maxX) {
        maxX = time;
      }
      if (time < minX) {
        minX = time;
      }
    });
  }

  // sort coordinates by x
  Object.entries(chartItems).forEach(([pidName, items]) => {
    chartItems[pidName] = items.sort((a, b) => a.x - b.x);
  });

  return {
    xRange: [minX, maxX],
    data: chartItems,
  };
};

export const handleCsvData = (data: CsvDataItem[], pids: Pid[]): CsvPocessedData => {
  const mode = getMode(data);
    if (mode === 1) {
    return processingMode1(data, pids);
  } 
  else if (mode === 2) {
    return processingMode2(data, pids);
  }
  return {
    xRange: [0,0],
    data: {},
  };
}; 