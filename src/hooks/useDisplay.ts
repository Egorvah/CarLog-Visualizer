import { useMantineTheme } from '@mantine/core';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';

function useDisplay() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const viewport = useViewportSize();
  
  return {
    isMobile,
    viewport,
  };
}
export default useDisplay;