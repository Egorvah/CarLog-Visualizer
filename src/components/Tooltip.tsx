import { Box, Text } from '@mantine/core';
import { getColorByLabel, sortPids } from '../utils/chart'

import type { TooltipProps } from 'recharts';

interface PidItem {
  name: string;
  value: number | string | undefined;
  color: string;
}

function Tooltip(props: TooltipProps<number, string>) {
  if (props?.active && props?.payload?.length) {
    const currentTime = props.payload[0]?.payload?.time || 'N/A';
    const pids: PidItem[] = [];
    props.payload.forEach((item) => {
      pids.push({
        name: String(item.name),
        value: item.value,
        color: String(item.color),
      });
    })
    const prevState = props.payload[0]?.payload?.prevState || {};
    Object.keys(prevState).forEach((pid) => {
      if (!pids.some((p) => p.name === pid)) {
        pids.push({
          name: pid,
          value: prevState[pid],
          color: getColorByLabel(pid),
        });
      }
    })

    const pidNames = sortPids(pids.map((pid) => pid.name));
    pids.sort((a, b) => pidNames.indexOf(a.name) - pidNames.indexOf(b.name));

    return (
      <Box bg="white" px="md" style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
        <Text style={{ margin: 3 }}>Time: { currentTime }</Text>
        {pids.map((pid: PidItem) => (
          <Text size="16px" key={pid.name} py="2px">
            <span style={{ color: pid.color, paddingRight: 4 }}>●</span>
            {pid.name}: <b>{ pid.value !== undefined ? pid.value : 'N/A' }</b>
          </Text>
        ))}
      </Box>
    );
  }

  return null;
};
export default Tooltip;