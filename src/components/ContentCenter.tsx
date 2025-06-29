
import { Flex, Center } from '@mantine/core';

type ContentCenterProps = React.ComponentProps<typeof Center> & {
  children: React.ReactNode;
  ref?: any;
};

function ContentCenter(props: ContentCenterProps) {
  return (
    <Center {...props} h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - var(--app-shell-padding) * 2)">
      <Flex w="100%" direction="column">
        {props.children}
      </Flex>
    </Center>
  );
}

export default ContentCenter;