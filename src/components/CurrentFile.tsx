import { Group, Button, Text } from '@mantine/core'

interface CurrentFileProps {
  filename?: string;
  buttonColor?: string;
  onResetFile?: () => void;
}

function CurrentFile(props: CurrentFileProps) {
  return (
    <Group>
      <Text>File: { props?.filename || 'N/A' }</Text>
      <Button
        variant="outline"
        size="xs"
        color={ props?.buttonColor || 'white' }
        onClick={ props?.onResetFile }
        style={{ marginLeft: 'auto' }}
      >
        Reset
      </Button>
    </Group>
  );
}  
export default CurrentFile;