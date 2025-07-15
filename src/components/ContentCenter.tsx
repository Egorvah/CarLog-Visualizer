
import { Flex, Center } from '@mantine/core';
import type { CenterProps } from '@mantine/core';

type ComponentProps = CenterProps & {
  children: React.ReactNode,
  ref?: React.RefObject<HTMLDivElement | null>,
};

function ContentCenter({ children, ...rest }: ComponentProps) {
  return (
    <Center { ...rest } h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - var(--app-shell-padding) * 2)">
      <Flex w="100%" direction="column">
        { children }
      </Flex>
    </Center>
  );
}

export default ContentCenter;