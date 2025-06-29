import { lazy, useState } from 'react';
import { AppShell, Center, Modal, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import useDisplay from './hooks/useDisplay';
import About from './components/About';
import Header from './components/Header';
import useFileStore from './stores/useFileStore';
import './App.css';

const FilterPids = lazy(() => import('./components/FilterPids'));
const Charts = lazy(() => import('./components/Charts'));

function App() {
  const [opened, { toggle }] = useDisclosure(true);
  const { isMobile } = useDisplay();
  const [error, setError] = useState<string | null>(null);
  const currentFile = useFileStore((state) => state.currentFilename);
  const appName = window?.document?.title;
  const isWaitingUpload = currentFile == null;

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 350,
          breakpoint: 'sm',
          collapsed: { 
            desktop: isWaitingUpload ? true : !opened,
            mobile: isWaitingUpload ? true : !opened
          },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Header
            appName={appName}
            isMobile={isMobile}
            isOpenFilter={opened}
            onToggleFilter={toggle}
          />
        </AppShell.Header>

        <AppShell.Navbar pl="md" pb="md">
          {!isWaitingUpload && (
            <FilterPids
              onToggleFilter={toggle}
            />
          )}
        </AppShell.Navbar>

        <AppShell.Main px={ isMobile && !isWaitingUpload ? '0' : '' }>
          <Center>
            {isWaitingUpload && (
              <About
                appName={appName}
                onError={setError}
              />
            )}

            {!isWaitingUpload && (
              <Charts
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
  );
}

export default App;