import { Group, Button, Text } from '@mantine/core';

interface ComponentProps {
  filename?: string;
  buttonColor?: string;
  onResetFile?: () => void;
}

function CurrentFile(props: ComponentProps) {
  return (
    <Group>
      <Text>File: { props?.filename || 'N/A' }</Text>
      <Button
        variant="outline"
        size="xs"
        color={ props?.buttonColor || 'white' }
        onClick={ props?.onResetFile }
      >
        Reset
      </Button>
    </Group>
  );
}  
export default CurrentFile;