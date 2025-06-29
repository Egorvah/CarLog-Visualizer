import { useState } from 'react';
import { FileButton, Button, Loader } from '@mantine/core';
import Papa from 'papaparse';
import { isValidCsv } from '../utils/csv';
import useFileStore from '../stores/useFileStore';

import type { CsvDataItem } from '../types';

interface ComponentProps {
  onError?: (error: string) => void;
}

function UploadCsv(props: ComponentProps) {
  const [loading, setLoading] = useState(false);
  const addFile = useFileStore((state) => state.addFile);

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

        const data = csv.data as CsvDataItem[];
        if (!isValidCsv(data)) {
          props.onError?.(`${ file.name } is not a valid CSV file.\nPlease upload a file with the correct format.`);
          setTimeout(() => setLoading(false), 450);
          return;
        }
        addFile(file.name, data);
        setLoading(false);
      } else {
        props.onError?.('Failed to read file as text.');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (<Loader />);
  }

  return (
    <FileButton onChange={handleFileChange} accept="text/csv">
      {(props) => <Button {...props}>Upload CSV File</Button>}
    </FileButton>
  );
}

export default UploadCsv;