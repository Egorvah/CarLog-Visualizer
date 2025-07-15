import BaseCsv from '@/utils/csv/Base';
import type {
  CsvData,
  CsvPocessedData,
  Pid,
  CsvDataset,
  ChartData,
  Columns,
} from '@/types';

class Vsdc extends BaseCsv implements CsvDataset {
  protected pidHeaderRow = 4;
  protected lastHeaderRow = 5;

  protected columns: Columns = {
    marker: 0,
  };

  constructor(data: CsvData) {
    super(data);
    this.columns = {
      ...this.columns,
      ...this.getColumnIndexes(),
    };
  }

  public isValidData(): boolean {
    return this.data[0]?.[5]?.includes('VCDS');
  }

  public getPids(): Pid[] {
    return Object.keys(this.columns)
      .filter(key => key !== 'marker' && key !== '');
  }

  protected getColumnIndexes(): Columns {
    const res: Columns = {};
    const len = this.data[this.pidHeaderRow]?.length;
    for (let i = this.columns.marker +2; i < len; i+=2) {
      const pid = this.data[this.pidHeaderRow][i].trim();
      if (pid === '') {
        continue;
      }

      const unit = this.data[this.lastHeaderRow][i].trim();
      const pidName = unit !== '' ? `${pid} (${unit})`: pid;
      res[pidName] = i;
    }
    return res;
  }

  public getChartData(pids: Pid[]): CsvPocessedData {
    const chartItems: ChartData = {};
    let maxX = 0;
    let minX = Number.MAX_SAFE_INTEGER;

    const startRow = this.lastHeaderRow + 1;
    for (let row = startRow; row < this.data.length; row++) {
      const dataRow = this.data?.[row];

      pids.forEach((pidName) => {
        if (dataRow?.[this.columns?.[pidName]] === '' || dataRow?.[this.columns?.[pidName]] === undefined) {
          return;
        }

        if (chartItems[pidName] == null) {
          chartItems[pidName] = [];
        }

        const pidIndex = this.columns?.[pidName];
        const time = Number(dataRow?.[pidIndex - 1]);

        chartItems[pidName].push({
          x: time,
          y: Number(dataRow?.[pidIndex]),
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
export default Vsdc;