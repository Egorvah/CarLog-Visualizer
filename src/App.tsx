import { useState } from 'react'
import { AppShell, Center, Modal, Alert } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import useDisplay from './hooks/useDisplay'
import UploadCsv from './components/UploadCsv'
import Charts from './components/Charts'
import Header from './components/Header'
import FilterPids from './components/FilterPids'
import './App.css'

import type { CsvData } from './utils/csv'

function App() {
  const [opened, { toggle }] = useDisclosure(true);
  const { isMobile } = useDisplay();
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const [data, setData] = useState<CsvData[]>([]);
  const [pids, setPids] = useState<string[]>([]);
  const [activePids, setActivePids] = useState<string[]>([]);
  const appName = window?.document?.title;

  const resetFile = () => {
    setData([]);
    setPids([]);
    setActivePids([]);
    setFilename(undefined);
  }

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 350,
          breakpoint: 'sm',
          collapsed: { 
            desktop: pids.length === 0 ? true : !opened,
            mobile: pids.length === 0 ? true : !opened
          },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Header
            appName={appName}
            filename={filename}
            isMobile={isMobile}
            isOpenFilter={opened}
            onToggleFilter={toggle}
            onResetFile={resetFile}
          />
        </AppShell.Header>

        <AppShell.Navbar pl="md" pb="md">
          { pids.length > 0 && (
            <FilterPids
              pids={pids}
              onActivePidsChange={setActivePids}
              onToggleFilter={toggle}
            />
          )}
        </AppShell.Navbar>

        <AppShell.Main px={ isMobile && activePids.length ? '0' : '' }>
          <Center>
            {data.length === 0 && (
              <UploadCsv
                appName={appName}
                onUpdateData={setData}
                onUpdateFilename={setFilename}
                onError={setError}
              />
            )}
            {data.length > 0 && (
              <Charts
                data={data} 
                activePids={activePids}
                onUpdatePids={setPids}
                isOpenFilter={opened}
                onToggleFilter={toggle}
              />
            )}
            {error && (
              <Modal
                title="Error"
                className="error-modal"
                opened={error != null} 
                onClose={() => setError(null)}  
                centered
              >
                <Alert color="red" variant="filled" className="message">
                  {error}
                </Alert>
              </Modal>
            )}
          </Center>
        </AppShell.Main>
      </AppShell>
    </>
  )
}

export default App