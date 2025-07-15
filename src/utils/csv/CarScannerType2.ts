import BaseCsv from '@/utils/csv/Base';
import type {
  CsvPocessedData,
  Pid,
  ChartData,
  CsvData,
  CsvDataset,
  Columns,
  ColumnNames,
} from '@/types';

class CarScannerType2 extends BaseCsv implements CsvDataset {
  private columnsNames: ColumnNames = {
    time: 'time',
  };

  constructor (data: CsvData) {
    super(data);
    this.columns = this.getColumnIndexes();
  }

  public isValidData(): boolean {
    return this.data?.[this.lastHeaderRow]?.includes(this.columnsNames.time);
  }

  public getPids(): Pid[] {
    return this.data[this.lastHeaderRow]
      .filter(key => key !== this.columnsNames.time && key !== '');
  }

  protected getColumnIndexes(): Columns {
    const res: Columns = {};
    const columnKeys = this.data[this.lastHeaderRow];
    for (const index in columnKeys) {
      const col = columnKeys[index];
      if (col != '') {
        res[col] = Number(index);
      }
    }
    return res;
  }

  private getSeconds(time: string): number {
    const timeGroup1 = time.split('.');
    const timeGroup2 = timeGroup1[0].split(':');

    const h = Number(timeGroup2[0]);
    const m = Number(timeGroup2[1]);
    const s = Number(timeGroup2[2]);
    const ms = Number(`0.${timeGroup1[1]}`);

    return Number((h * (3600 / 1) + (m * 60) / 1 + s + ms).toFixed(3));
  };

  public getChartData(pids: Pid[]): CsvPocessedData {
    const chartItems: ChartData = {};
    let maxX = 0;
    let minX = Number.MAX_SAFE_INTEGER;

    const startRow = this.lastHeaderRow + 1;
    const startSecond = this.getSeconds(this.data[startRow]?.[this.columns.time]);

    for (let row = startRow; row < this.data.length; row++) {
      const dataRow = this.data?.[row];
      if (dataRow?.[this.columns.time] == null || dataRow?.[this.columns.time] === '') {
        continue;
      }

      const time = Number(Number(this.getSeconds(dataRow?.[this.columns.time]) - startSecond).toFixed(3));

      pids.forEach((pidName) => {
        if (dataRow?.[this.columns?.[pidName]] === '' || dataRow?.[this.columns?.[pidName]] === undefined) {
          return;
        }

        if (chartItems[pidName] == null) {
          chartItems[pidName] = [];
        }

        chartItems[pidName].push({
          x: time,
          y: Number(dataRow?.[this.columns?.[pidName]]),
        });

        if (time > maxX) {
          maxX = time;
        }
        if (time < minX) {
          minX = time;
        }
      });
    }

    return {
      xRange: [minX, maxX],
      data: this.sortByXAxis(chartItems),
    };
  }
}
export default CarScannerType2;