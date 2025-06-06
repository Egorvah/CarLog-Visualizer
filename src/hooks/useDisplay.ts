import { useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

function useDisplay() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  
  return {
    isMobile,
  };
}
export default useDisplay;