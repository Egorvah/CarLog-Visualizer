import { useState, useEffect } from 'react'
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  Brush, CartesianGrid, ReferenceLine, Customized
} from 'recharts'
import { Box, Flex, Title, Text, Table, Divider, Button, Center } from '@mantine/core'
import useChartData from '../hooks/useChartData'
import CustomTooltip from './Tooltip'
import ContentCenter from './ContentCenter'
import ChartPreviousDots from './ChartPreviousDots'
import { getColorByLabel, sortPids } from '../utils/chart'

import type { TooltipProps } from 'recharts';

interface ChartsProps {
  data: Record<string, string | number>[];
  activePids: string[];
  isOpenFilter?: boolean;
  onToggleFilter?: () => void;
  onUpdatePids: (pids: string[]) => void;
}

interface RefLineState {
  posX: string | number | undefined;
  state: Record<string, string | number>;
}

function Charts(props: ChartsProps) {
  const [brushState, setBrushState] = useState({ startIndex: 0, endIndex: 0 });
  const [refLine, setRefLine] = useState<RefLineState | null>(null);
  const { data: chartData, pids } = useChartData(props.data, props.activePids || []);
  const XAxisDataKey = "time";


  useEffect(() => {
    props.onUpdatePids(pids);
  }, [pids]); // eslint-disable-line

  useEffect(() => {
    setBrushState({
      startIndex: 0,
      endIndex: chartData.length > 1000 ? 1000 : chartData.length - 1,
    });
    setRefLine(null);
  }, [chartData]);

  const handleBrushChange = (brush: { startIndex?: number; endIndex?: number }) => {
    setBrushState({
      startIndex: brush.startIndex ?? 0,
      endIndex: brush.endIndex ?? (chartData.length - 1),
    });
  }

  const handleRefLineChange = (event: { activeLabel?: string | number, activePayload?: any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */| undefined }) => {
    if (event?.activeLabel) {
      const payload = event?.activePayload?.[0]?.payload || {};
      const state: Record<string, string | number> = {
        ...payload.prevState,
        ...payload,
      };
      delete state.prevState;

      setRefLine({
        posX: event?.activeLabel || undefined,
        state: state,
      });
    }
  }

  const getChartHeight = () => {
    if (props.activePids.length > 5) {
      return ((props.activePids.length / 4) * 30) + 500;
    }
    return 500;
  }

  return (
    <Flex w="100%" direction="column" gap="md">
      {props.activePids.length === 0 && (
        <ContentCenter>
          <Title order={3} ta="center">No active PIDs selected</Title>
          <Text ta="center">Please select at least one PID to display the chart.</Text>
          { !props.isOpenFilter && (
            <Center mt="md">
              <Button w="fit-content" onClick={props.onToggleFilter}>
                Open Filter
              </Button>
            </Center>
          )}
        </ContentCenter>
      )}

      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={ getChartHeight() }>
          <LineChart
            data={chartData}
            syncId="export1"
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
            onClick={handleRefLineChange}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={ XAxisDataKey } tickSize={ 10 } allowDecimals={ false }/>
            <YAxis tickCount={ 6 } />
            <Tooltip content={({active, payload}: TooltipProps<number, string>) => <CustomTooltip active={active} payload={payload} />} />
            <Legend />

            {props.activePids.map((pid) => (
              <Line
                key={pid}
                connectNulls
                type="monotone"
                dataKey={pid}
                dot={false}
                stroke={getColorByLabel(pid)}
                strokeWidth={2}
              />
            ))}

            <Brush
              dataKey={ XAxisDataKey }
              onChange={handleBrushChange}
              startIndex={ brushState.startIndex }
              endIndex={ brushState?.endIndex || chartData.length - 1 }
            />
            {refLine != null && (
              <ReferenceLine x={refLine.posX} stroke="black" strokeWidth={2} />
            )}
            <Customized component={(props: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => <ChartPreviousDots {...props} />} />
          </LineChart>
        </ResponsiveContainer>
      )}

      {refLine != null && (
        <Box mt="md" p="md">
          <Divider mb="md" />
          <Button size="xs" mb="xs" onClick={() => setRefLine(null)} >
            Remove Reference Line
          </Button>
          <Table withTableBorder highlightOnHover striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>State</Table.Th>
                <Table.Th>Value</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>{ XAxisDataKey }</Table.Td>
                <Table.Td>{ refLine.state[XAxisDataKey] }</Table.Td>
              </Table.Tr>
              {sortPids(Object.keys(refLine.state).filter(key => key !== XAxisDataKey)).map(key => (
                <Table.Tr key={key}>
                  <Table.Td>{key}</Table.Td>
                  <Table.Td>{refLine.state[key].toString()}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      )}
    </Flex>
  );

}
export default Charts;