import { lazy } from 'react';
import { Title, Text, Box, Center, List, Tooltip, Image, Mark } from '@mantine/core';
import useDisplay from '@/hooks/useDisplay';
import ContentCenter from '@/components/ContentCenter';
import logoImage from '@/assets/logo.png';
import questionCircleImage from '@/assets/question-circle.svg';

const UploadCsv = lazy(() => import('@/components/UploadCsv'));

interface ComponentProps {
  appName: string;
}

function About(props: ComponentProps) {
  const { isMobile } = useDisplay();
  const logoSize = isMobile ? 120 : 250;

  const sourceItem = (sourceName: string, sourceTip: string | null = null) => (
    <>
      <Text mr="xs" h="lg">
        { sourceName }
        { sourceTip != null &&
          <Tooltip label={ sourceTip }>
            <Image
              className="question-circle-icon"
              src={ questionCircleImage }
              alt={ sourceTip }
            />
          </Tooltip>
        }
      </Text>
    </>
  );

  return (
    <ContentCenter>
      <Center mb="xs">
        <Image src={ logoImage } h={ logoSize } w={ logoSize } radius="xl" alt="logo" />
      </Center>
      
      <Title ta="center">{ props.appName }</Title>
      <Text size="md" mb="md">{ __APP_DESCRIPTION__ }</Text>
      <Text mb="xl">
        <Mark color="orange">Your data stays private</Mark> — everything is processed locally in your browser.
      </Text>
      
      <Box pl="xl">
        <Text size="md">Supported sources:</Text>
        <List pl="md">
          <List.Item>
            { sourceItem('Car Scanner', 'Car Scanner ELM OBD2') }
          </List.Item>
          <List.Item>
            { sourceItem('VCDS (VAG-COM Diagnostic System)', 'Windows-based Diagnostic Software for VW / Audi / Seat / Skoda') }
          </List.Item>
        </List>
      </Box>

      <Center pt="xl">
        <UploadCsv />
      </Center>
    </ContentCenter>
  );
}

export default About;