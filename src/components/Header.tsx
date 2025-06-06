import { Group, Title, Text, Image, Button, Menu } from '@mantine/core'
import CurrentFile from './CurrentFile'
import githubMarkSvg from '../assets/github-mark.svg'
import filteEmptySvg from '../assets/filter-empty.svg'
import filterFullSvg from '../assets/filter-full.svg'

interface HeaderProps {
  appName: string;
  filename?: string;
  isMobile?: boolean;
  isOpenFilter?: boolean;
  onToggleFilter?: () => void;
  onResetFile?: () => void;
}

function Header(props: HeaderProps) {

  const mobileCntent = (
    <Menu withArrow>
      <Menu.Target>
        <Button
          variant="outline"
          color="white"
        >•••</Button>
      </Menu.Target>
      <Menu.Dropdown>
        { props?.filename && (
          <Menu.Item>
            <CurrentFile
              filename={ props?.filename }
              buttonColor="black"
              onResetFile={ props?.onResetFile }
            />
          </Menu.Item>
        )}
        <Menu.Item
          leftSection={ <Image src={githubMarkSvg} h={32} style={{ filter: 'invert(1)' }} /> }
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
  )

  const desktopContent = (
    <>
      <div>
        { props?.filename && (
          <CurrentFile
            filename={ props?.filename }
            onResetFile={ props?.onResetFile }
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
        {props?.filename && (
          <Button onClick={props?.onToggleFilter}>
            <Image src={ props.isOpenFilter ? filterFullSvg : filteEmptySvg } w={ 32 } />
          </Button>
        )}
        <Title order={3}>{ props.appName }</Title>
      </Group>

      {props.isMobile ? mobileCntent : desktopContent}

      {/* <div>{ props?.filename && (
        <CurrentFile
          filename={ props?.filename }
          onResetFile={ props?.onResetFile }
        />
      )}</div>

      <Group>
        <Button
          variant="transparent"
          component="a"
          href={ __APP_REPO_URL__ }
          target="_blank"
        >
          <Image src={ githubMark } w={ 32 } h={ 32 } />
        </Button>
        <Text c="gray.4" mr="md">v{ __APP_VERSION__ }</Text>
      </Group> */}
    </Group>
  );
}
export default Header;