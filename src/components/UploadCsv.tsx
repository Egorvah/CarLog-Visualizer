import { useState } from 'react';
import { FileButton, Button, Loader, Modal, Alert } from '@mantine/core';
import { parse } from 'papaparse';
import { detect } from 'chardet';
import { getFileType } from '@/utils/csv';
import useFileStore from '@/stores/useFileStore';
import type { CsvData } from '@/types';

function UploadCsv() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addFile = useFileStore((state) => state.addFile);

  const handleFileChange = (file: File | null) => {
    setLoading(true);
    if (!file) {
      setError('No file selected');
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const arrayBuffer = target?.result as ArrayBuffer;
      const byteArray = new Uint8Array(arrayBuffer);
      const encoding = detect(byteArray) || 'UTF-8';

      const fileContent = new TextDecoder(encoding).decode(arrayBuffer);
      const csv = parse(fileContent, {
        header: false,
        skipEmptyLines: 'greedy',
      });

      const data = csv.data as CsvData;
      const fileType = getFileType(data);
      if (fileType == null) {
        setError(`${ file.name } is not a valid CSV file.\nPlease upload a file with the correct format.`);
        setTimeout(() => setLoading(false), 450);
        return;
      }
      addFile(file.name, fileType);
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      { loading
        ? <Loader />
        :
          <FileButton onChange={ handleFileChange } accept="text/csv">
            {(props) => <Button { ...props }>Upload CSV File</Button>}
          </FileButton>
      }

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
    </>
  );
}

export default UploadCsv;