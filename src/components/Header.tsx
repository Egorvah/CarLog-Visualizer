import { Group, Title, Text, Image, Button, Menu } from '@mantine/core';
import CurrentFile from './CurrentFile';
import useChartStore from '../stores/useChartStore';
import useFileStore from '../stores/useFileStore';
import githubMarkSvg from '../assets/github-mark.svg';
import filteEmptySvg from '../assets/filter-empty.svg';
import filterFullSvg from '../assets/filter-full.svg';

interface ComponentProps {
  appName: string;
  isMobile?: boolean;
  isOpenFilter?: boolean;
  onToggleFilter?: () => void;
}

function Header(props: ComponentProps) {
  const currentFilename = useFileStore((state) => state.currentFilename);
  const removeFile = useFileStore((state) => state.removeFile);
  const clearAllChartData = useChartStore((state) => state.clearAll);

  const handleReset = () => {
    if (currentFilename != null) {
      removeFile(currentFilename);
      clearAllChartData();
    }
  };

  const mobileCntent = (
    <Menu withArrow position="bottom-end">
      <Menu.Target>
        <Button
          variant="outline"
          color="white"
        >
          •••
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        { currentFilename && (
          <Menu.Item>
            <CurrentFile
              buttonColor="black"
              filename={ currentFilename }
              onResetFile={ handleReset }
            />
          </Menu.Item>
        )}
        <Menu.Item
          leftSection={ <Image src={githubMarkSvg} h={32} w={33} style={{ filter: 'invert(1)' }} /> }
          component="a"
          href={__APP_REPO_URL__}
          target="_blank"
        >
          GitHub
        </Menu.Item>
        <Menu.Item disabled>
          Version: { __APP_VERSION__ }
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  const desktopContent = (
    <>
      <div>
        { currentFilename && (
          <CurrentFile
            filename={ currentFilename }
            onResetFile={ handleReset }
          />
        )}
      </div>

      <Group>
        <Button
          variant="transparent"
          component="a"
          href={ __APP_REPO_URL__ }
          target="_blank"
        >
          <Image src={ githubMarkSvg } w={ 32 } h={ 32 } />
        </Button>
        <Text c="gray.4" mr="md">v{ __APP_VERSION__ }</Text>
      </Group>
    </>
  );

  return (
    <Group px="md" h="100%" justify="space-between" className='app-header'>
      <Group>
        {currentFilename && (
          <Button onClick={props?.onToggleFilter}>
            <Image src={ props.isOpenFilter ? filterFullSvg : filteEmptySvg } w={ 32 } />
          </Button>
        )}
        <Title order={3}>{ props.appName }</Title>
      </Group>

      {props.isMobile ? mobileCntent : desktopContent}
    </Group>
  );
}
export default Header;