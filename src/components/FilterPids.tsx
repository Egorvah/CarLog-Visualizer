import { useState, useEffect, useCallback } from 'react';
import { ScrollArea, Switch, Divider, Input, Text, Button, Group, CloseButton } from '@mantine/core';
import debounce from '../utils/debounce';
import useChartStore from '../stores/useChartStore';
import type { Pid } from '../types';

interface ComponentProps {
  onToggleFilter?: () => void;
}

function FilterPids({ onToggleFilter }: ComponentProps) {
  const pids: Pid[] = useChartStore((state) => state.pids);
  const activePids = useChartStore((state) => state.activePids);
  const setActivePids = useChartStore((state) => state.setActivePids);
  const [localActivePids, setLocalActivePids] = useState<Pid[]>(activePids);
  const [filteredPids, setFilteredPids] = useState<Pid[]>(pids);
  const [filterValue, setFilterValue] = useState<string>('');

  const debouncedSetActivePids = useCallback(
    debounce((newActivePids: Pid[]): void => {
      setActivePids(newActivePids);
    }, 500),
    [setActivePids]
  );

  useEffect(() => debouncedSetActivePids(localActivePids), [debouncedSetActivePids, localActivePids]);

  const handleChangeFilterValue = (newVal: string) => {
    setFilteredPids(
      pids.filter((pid: string) => pid.toLowerCase().includes(newVal.toLowerCase()))
    );
    setFilterValue(newVal);
  };

  const togglePid = (event: React.ChangeEvent<HTMLInputElement>, pid: string) => {
    const newActivePids = event.currentTarget.checked
      ? [...localActivePids, pid]
      : localActivePids.filter((p) => p !== pid);
    setLocalActivePids(newActivePids);
  };

  if (pids.length && !filteredPids.length && filterValue.length === 0) {
    setFilteredPids(pids);
  }

  if (pids.length < 1) {
    return (
      <Text size="md" mt="md" mb="xs">PIDs not found.</Text>
    );
  }

  return (
    <>
      <Group justify="space-between" mr="md">
        <Text size="md" mt="md" mb="xs">Active PIDs</Text>
        <Button.Group>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setLocalActivePids([])}
            disabled={localActivePids.length === 0}
          >
            Clear All
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setLocalActivePids(filteredPids)}
            disabled={filteredPids.length === 0 || filteredPids.length === localActivePids.length}
          >
            Select All
          </Button>
        </Button.Group>
      </Group>

      <Input
        placeholder="Filter"
        value={filterValue}
        onChange={(event) => handleChangeFilterValue(event.currentTarget.value)}
        size="sm"
        mr="md"
        rightSectionPointerEvents="all"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => handleChangeFilterValue('')}
            style={{ display: filterValue ? undefined : 'none' }}
          />
        }
      />
      <Divider mt="xs" mb="md" />

      <ScrollArea type="always" offsetScrollbars>
        {filteredPids.length > 0 && filteredPids.map((pid, index) => (
          <div key={pid}>
            <Switch
              label={pid}
              withThumbIndicator={false}
              checked={localActivePids.includes(pid)}
              onChange={(event) => togglePid(event, pid)}
            />
            {index < filteredPids.length - 1 && (
              <Divider my="xs" />
            )}
          </div>
        ))}
        {filteredPids.length === 0 && (
          <div style={{ padding: '10px' }}>
            <span>No PIDs found by filter</span>
          </div>
        )}
      </ScrollArea>

      <Button mt="md" mr="md" onClick={onToggleFilter} >
         Collapse
      </Button>
    </>
  );
}
export default FilterPids;