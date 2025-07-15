import { lazy } from 'react';
import { AppShell, Center } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import useDisplay from '@/hooks/useDisplay';
import About from '@/components/About';
import Header from '@/components/Header';
import useFileStore from '@/stores/useFileStore';
import '@/App.css';

const Filter = lazy(() => import('@/components/Filter'));
const Charts = lazy(() => import('@/components/Charts'));

function App() {
  const [opened, { toggle }] = useDisclosure(true);
  const { isMobile } = useDisplay();
  const currentFile = useFileStore((state) => state.currentFilename);
  const appName = window?.document?.title;
  const isWaitingUploadFile = currentFile == null;

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 350,
          breakpoint: 'sm',
          collapsed: { 
            desktop: isWaitingUploadFile ? true : !opened,
            mobile: isWaitingUploadFile ? true : !opened
          },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Header
            appName={ appName }
            isMobile={ isMobile }
            isOpenFilter={ opened }
            onToggleFilter={ toggle }
          />
        </AppShell.Header>

        <AppShell.Navbar pl="md" pb="md">
          {!isWaitingUploadFile && (
            <Filter onToggleFilter={ toggle } />
          )}
        </AppShell.Navbar>

        <AppShell.Main px={ isMobile && !isWaitingUploadFile ? '0' : '' }>
          <Center>
            {isWaitingUploadFile 
              ? ( <About appName={ appName } /> )
              : ( <Charts isOpenFilter={ opened } onToggleFilter={ toggle } /> )
            }
          </Center>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;