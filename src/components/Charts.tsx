import { useState, useRef } from 'react';
import { Flex, Title, Text, Button, Center, RangeSlider } from '@mantine/core';
import useChartData from '@/hooks/useChartData';
import ContentCenter from '@/components/ContentCenter';
import Chart from '@/components/Chart';
import useFileStore from '@/stores/useFileStore';
import useChartStore from '@/stores/useChartStore';
import type { CsvDatasets, fromTo, Pid } from '@/types';

interface ComponentProps {
  isOpenFilter?: boolean;
  onToggleFilter?: () => void;
}

function Charts(props: ComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const datasets: CsvDatasets = useFileStore((state) => state.files);
  const activePids: Pid[] = useChartStore((state) => state.activePids);
  const prevPids = useChartStore((state) => state.pids);
  const setPids = useChartStore((state) => state.setPids);
  const [singleChart, setSingleChart] = useState(true);
  const { data: chartData, pids, xRange } = useChartData(datasets, activePids || []);
  const [chartFromTo, setChartFromTo] = useState<fromTo>(xRange);
  const [height, setHeight] = useState<number>(0);

  if (ref?.current != null && height != ref.current.clientHeight) {
    setHeight(ref.current.clientHeight);
  }

  const getChartHeight = () => {
    const h = height <= 800 ? height : 800;
    if (singleChart) {
      return h;
    }
    return h / 2;
  };
  
  const isExistsChardData = () => {
    return Object.entries(chartData).length > 0;
  };

  if (prevPids != pids) {
    setPids(pids);
  }
  if (chartFromTo[0] === 0 && chartFromTo[1] === 0 && chartFromTo !== xRange) {
    setChartFromTo(xRange);
  }

  if (activePids.length === 1 && !singleChart) {
    setSingleChart(true);
  }

  if (activePids.length === 0) {
    return (
      <ContentCenter ref={ ref }>
          <Title order={ 3 } ta="center">No active PIDs selected</Title>
          <Text ta="center">Please select at least one PID to display the chart.</Text>
          { !props.isOpenFilter && (
            <Center mt="md">
              <Button w="fit-content" onClick={ props.onToggleFilter }>
                Open Filter
              </Button>
            </Center>
          )}
        </ContentCenter>
    );
  }

  return (
    <Flex w="100%" direction="column" gap="sm">
      <Button.Group>
        <Button
          variant={ singleChart ? 'filled' : 'outline' }
          size="xs"
          onClick={ () => setSingleChart(true) }
        >
          Single chart
        </Button>
        <Button
          variant={ !singleChart ? 'filled' : 'outline' }
          size="xs"
          onClick={ () => setSingleChart(false) }
          disabled={ activePids.length < 2 }
        >
          Multiple charts
        </Button>
      </Button.Group>

      { xRange[1] > 0 &&
        <RangeSlider
          className="chart-range"
          size="xl"
          px="xl"
          mb="md"
          labelAlwaysOn={ true }
          min={ xRange[0] }
          max={ xRange[1] + 1 }
          onChangeEnd={ setChartFromTo }
        />
      }

      {/* Single chart */}
      {isExistsChardData() && singleChart && (
        <Chart
          chartData={ chartData }
          fromTo={ chartFromTo }
          pids={ activePids }
          height={ getChartHeight() }
        />
      )}

      {/* Multiple charts */}
      {isExistsChardData() && !singleChart && activePids.map((pid) => (
        <div key={ pid }>
          <Title
            order={ 5 }
            ta="center"
            p="0"
            m="0"
          >
            { pid }
          </Title>
          <Chart
            chartData={ chartData }
            fromTo={ chartFromTo }
            pids={ [pid] }
            height={ getChartHeight() }
          />
        </div>
      ))}
    </Flex>
  );
}
export default Charts;