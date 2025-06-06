
import { Flex, Center } from '@mantine/core'

function ContentCenter({ children }: { children: React.ReactNode }) {
  return (
    <Center h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - var(--app-shell-padding) * 2)">
      <Flex w="100%" direction="column">
        {children}
      </Flex>
    </Center>
  );
}
export default ContentCenter;