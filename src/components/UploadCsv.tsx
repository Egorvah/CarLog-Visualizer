import { useState } from 'react'
import { FileButton, Button, Title, Text, Box, Center, List, Tooltip, Image, Loader, Mark } from '@mantine/core';
import Papa from 'papaparse'
import useDisplay from '../hooks/useDisplay'
import ContentCenter from './ContentCenter'
import { isValidCsv } from '../utils/csv'
import logo from '../assets/logo.png'

import type { CsvData } from '../utils/csv'
interface UploadCsvProps {
  appName: string;
  onUpdateData?: (data: CsvData[]) => void;
  onUpdateFilename?: (filename: string) => void;
  onError?: (error: string) => void;
}

function UploadCsv(props: UploadCsvProps) {
  const { isMobile } = useDisplay();
  const [loading, setLoading] = useState(false);

  const handleFileChange = (file: File | null) => {
    setLoading(true);
    if (!file) {
      props.onError?.('No file selected');
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      if (typeof target?.result === 'string') {
        const csv = Papa.parse(target.result, {
          header: true,
        });

        const data = csv.data as CsvData[];
        if (!isValidCsv(data)) {
          props.onError?.(`${ file.name } is not a valid CSV file.\nPlease upload a file with the correct format.`);
          setTimeout(() => setLoading(false), 450);
          return;
        }
        props.onUpdateData?.(data);
        props.onUpdateFilename?.(file.name);
        setLoading(false);
      } else {
        props.onError?.('Failed to read file as text.');
      }
    };
    reader.readAsText(file);
  }

  const logoSize = isMobile ? 120 : 250;

  return (
    <ContentCenter>
      <Center mb="xs">
        <Image src={logo} h={ logoSize } w={ logoSize } radius="xl" />
      </Center>
      <Title ta="center">{ props.appName }</Title>
      <Text size="md" mb="md">{ __APP_DESCRIPTION__}</Text>
      <Text mb="xl">
        <Mark color="orange">Your data stays private</Mark> — everything is processed locally in your browser.
      </Text>
      
      <Box pl="xl">
        <Text size="md">Supported sources:</Text>
        <List pl="md">
          <List.Item>
            <Tooltip label="Car Scanner ELM OBD2">
              <Text component="span" c="blue" mr="xs">Car Scanner</Text>
            </Tooltip>
            (<a href="https://play.google.com/store/apps/details?id=com.ovz.carscanner" target="_blank" rel="noreferrer noopener">Android</a> | <a href="https://apps.apple.com/us/app/car-scanner-elm-obd2/id1259933623" target="_blank" rel="noreferrer noopener">iOS</a>)
          </List.Item>
          {/* <List.Item>
            <Tooltip label="Windows-based Diagnostic Software for VW / Audi / Seat / Skoda">
              <Text component="span" c="blue" mr="xs">VCDS</Text>
            </Tooltip>
          </List.Item>  */}
        </List>
      </Box>

      <Center pt="xl">
        {loading && (
          <Loader />
        )}
        {!loading && (
          <FileButton onChange={handleFileChange} accept="text/csv">
            {(props) => <Button {...props}>Upload CSV File</Button>}
          </FileButton>
        )}
      </Center>
    </ContentCenter>
  )
}

export default UploadCsv;