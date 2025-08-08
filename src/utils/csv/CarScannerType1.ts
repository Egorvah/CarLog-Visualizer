import BaseCsv from '@/utils/csv/Base';
import type {
  CsvDataItem,
  CsvPocessedData,
  Pid,
  ChartData,
  CsvData,
  CsvDataset,
  Columns,
  ColumnNames,
} from '@/types';

class CarScannerType1 extends BaseCsv implements CsvDataset {
  protected columnNames: ColumnNames = {
    time: 'SECONDS',
    pid: 'PID',
    value: 'VALUE',
    unit: 'UNITS',
  } as const;

  constructor (data: CsvData) {
    super(data);
    this.columns = this.getColumnIndexes();
  }

  public isValidData(): boolean {
    const header = this.data?.[this.lastHeaderRow];
    const expectedColumns = Object.values(this.columnNames);
    return expectedColumns.every((col) => header?.includes(col));
  }

  public getPids(): Pid[] {
    const pids: Pid[] = [];
    for (let row = this.lastHeaderRow + 1; row < this.data.length; row++) {
      const pidName = this.getPidName(this.data?.[row]);
      if (pidName !== '' && !pids.includes(pidName)) {
        pids.push(pidName);
      }
    }
    return pids;
  }

  protected getColumnIndexes(): Columns {
    const res: Columns = {};
    const columnKeys = Object.keys(this.columnNames);
    for (const col of columnKeys) {
      res[col] = this.data[this.lastHeaderRow]?.indexOf(this.columnNames[col]);
    }
    return res;
  }

  private getPidName(rowData: CsvDataItem):Pid {
      const pid = rowData?.[this.columns.pid];
      const unit = rowData?.[this.columns.unit];
      return unit !== '' ? `${pid} (${unit})` : String(pid);
  }

  public getChartData(pids: Pid[]): CsvPocessedData {
    const chartItems: ChartData = {};
    let maxX = 0;
    let minX = Number.MAX_SAFE_INTEGER;

    const startRow = this.lastHeaderRow + 1;
    const startSecond = Number(this.data[startRow]?.[this.columns.time]);

    for (let row = startRow; row < this.data.length; row++) {
      const time = Number(
        Number(Number(this.data?.[row]?.[this.columns.time]) - startSecond).toFixed(3),
      );
      const pidName = this.getPidName(this.data?.[row]);
      if (pidName !== '' && pids.includes(pidName)) {
        const value = Number(this.data?.[row]?.[this.columns.value]);

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
      }
    }

    return {
      xRange: [minX, maxX],
      data: this.sortByXAxis(chartItems),
    };
  }
}
export default CarScannerType1;