import { useState, lazy } from 'react';
import { Title, Text, Box, Center, List, Tooltip, Image, Mark, Modal, Alert } from '@mantine/core';
import useDisplay from '@/hooks/useDisplay';
import ContentCenter from '@/components/ContentCenter';
import logo from '@/assets/logo.png';

const UploadCsv = lazy(() => import('@/components/UploadCsv'));

interface ComponentProps {
  appName: string;
}

function About(props: ComponentProps) {
  const { isMobile } = useDisplay();
  const [error, setError] = useState<string | null>(null);
  const logoSize = isMobile ? 120 : 250;

  return (
    <ContentCenter>
      <Center mb="xs">
        <Image src={ logo } h={ logoSize } w={ logoSize } radius="xl" alt="logo" />
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
            <Tooltip label="Car Scanner ELM OBD2">
              <Text component="span" c="blue.8" mr="xs">Car Scanner</Text>
            </Tooltip>
            (<a href="https://play.google.com/store/apps/details?id=com.ovz.carscanner" target="_blank" rel="noreferrer noopener">Android</a> | <a href="https://apps.apple.com/us/app/car-scanner-elm-obd2/id1259933623" target="_blank" rel="noreferrer noopener">iOS</a>)
          </List.Item>
          <List.Item>
            <Tooltip label="Windows-based Diagnostic Software for VW / Audi / Seat / Skoda">
              <Text component="span" c="blue.8" mr="xs">VCDS (VAG-COM Diagnostic System)</Text>
            </Tooltip>
          </List.Item>
        </List>
      </Box>

      <Center pt="xl">
        <UploadCsv onError={ setError } />
      </Center>
      
      {error && (
        <Modal
          title="Error"
          className="error-modal"
          opened={ error != null } 
          onClose={ () => setError(null) }  
          centered
        >
          <Alert color="red" variant="filled" className="message">
            {error}
          </Alert>
        </Modal>
      )}
    </ContentCenter>
  );
}

export default About;