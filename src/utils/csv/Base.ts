import type { CsvData, ChartData, Columns } from '@/types';

class BaseCsv {
  protected lastHeaderRow = 0;
  protected data: CsvData = [];
  protected columns: Columns = {};

  constructor (data: CsvData) {
    this.data = data;
  }

  protected sortByXAxis(chartItems: ChartData): ChartData {
    Object.entries(chartItems).forEach(([pidName, items]) => {
      chartItems[pidName] = items.sort((a, b) => a.x - b.x);
    });
    return chartItems;
  }
}
export default BaseCsv;