import { useState, useEffect } from 'react'
import { ScrollArea, Switch, Divider, Input, Text, Button, Group, CloseButton } from '@mantine/core'

interface FilterPidsProps {
  pids: string[];
  onActivePidsChange?: (activePids: string[]) => void;
  onToggleFilter?: () => void;
}

function FilterPids(props: FilterPidsProps) {
  const [activePids, setActivePids] = useState<string[]>([]);
  const [filteredPids, setFilteredPids] = useState<string[]>(props.pids);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    if (props?.pids) {
      props?.onActivePidsChange?.(activePids);
    }
  }, [activePids]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setFilteredPids(
      props?.pids.filter((pid: string) => pid.toLowerCase().includes(filterValue.toLowerCase()))
    );
  }, [props.pids, filterValue]);

  const togglePid = (event: React.ChangeEvent<HTMLInputElement>, pid: string) => {
    const newActivePids = event.currentTarget.checked
      ? [...activePids, pid]
      : activePids.filter((p) => p !== pid);
    setActivePids(newActivePids);
  }

  return (
    <>
      <Group justify="space-between" mr="md">
        <Text size="md" mt="md" mb="xs">Active PIDs</Text>
        <Button.Group>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setActivePids([])}
            disabled={activePids.length === 0}
          >
            Clear All
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setActivePids(filteredPids)}
            disabled={filteredPids.length === 0 || filteredPids.length === activePids.length}
          >
            Select All
          </Button>
        </Button.Group>
      </Group>

      <Input
        placeholder="Filter"
        value={filterValue}
        onChange={(event) => setFilterValue(event.currentTarget.value)}
        size="sm"
        mr="md"
        rightSectionPointerEvents="all"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => setFilterValue('')}
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
              checked={activePids.includes(pid)}
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
      <Button mt="md" mr="md" onClick={props.onToggleFilter} >
         Collapse
      </Button>
    </>
  )
}
export default FilterPids;