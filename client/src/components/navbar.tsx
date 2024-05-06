import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { User } from '../../../shared/types/models';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface ComponentProps {
  user: User | null;
}

const NavbarComponent: React.FC<ComponentProps> = (props) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const redirect = useNavigate();
  const component = React.useRef<HTMLDivElement>(null);

  return (
    <div className='w-full flex flex-col' ref={component}>
      {props.user && (
        <div className={props.user?.preferences.general.theme == 'dark' ? 'dark' : ''}>
          <div className='text-neutral-700 w-full flex items-center justify-between p-4 h-16 dark:bg-gray-700 bg-white shadow-md z-10 absolute top-0'>
            <Link
              onClick={() => {
                redirect('/home');
              }}
              to='/home'
              className='text-2xl dark:text-white text-neutral-800 font-bold flex items-center gap-2'
            >
              <img src='/assets/images/logo-no-background.png' className='w-8' />
              DIMLIM
            </Link>
            <div className='w-auto md:w-2/12'>
              <DropdownMenu.Root
                open={menuOpen}
                onOpenChange={(change) => {
                  setMenuOpen(change);
                }}
              >
                <DropdownMenu.Trigger className='outline-none flex items-center justify-between px-4 py-2 rounded-md border-2 dark:border-white/20 transition-all dark:hover:bg-white/10 cursor-pointer w-full'>
                  <div className='flex items-center justify-center'>
                    <div>
                      <img
                        width={30}
                        src='https://www.asterki.com/assets/images/icon.png'
                        alt='wjaoi'
                        className='mr-2 rounded-full'
                      />
                    </div>
                    <div className='dark:text-white'>{props.user.profile.username}</div>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      className={`${
                        menuOpen ? 'transform rotate-180 px-2' : ''
                      } transition-all dark:text-white/50 text-slate-400/50 px-2`}
                      icon={faChevronCircleDown}
                    />
                  </div>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal container={component.current!}>
                  <DropdownMenu.Content
                    align='end'
                    className='dark:text-white text-neutral-700 dark:bg-gray-700 bg-slate-100 transition-all rounded-md border-2 dark:border-white/20 border-slate-400 w-full'
                  >
                    <DropdownMenu.Item className='p-2 transition-all dark:hover:bg-white/20 hover:bg-slate-200 cursor-pointer w-full'>
                      <Link to='/settings'>Settings</Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className='p-2 transition-all dark:hover:bg-white/20 hover:bg-slate-200 cursor-pointer w-full'>
                      <Link to='/contacts'>Contacts</Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className='p-2 transition-all dark:hover:bg-white/20 hover:bg-slate-200 cursor-pointer w-full'>
                      <Link to='/logout'>Logout</Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>
      )}
      {!props.user && (
        <div className='w-full flex items-center justify-between p-4 h-16 dark:bg-gray-700 bg-white shadow-md z-10 absolute top-0'>
          <Link
            onClick={() => {
              redirect('/');
            }}
            to='/'
            className='text-2xl dark:text-white text-neutral-800 font-bold flex items-center gap-2'
          >
            <img src='/assets/images/logo-no-background.png' className='w-8' />
            DIMLIM
          </Link>
          <div className='w-1/2 flex items-center justify-end md:w-3/12'>
            <Link
              to='/login'
              className='mr-2 hover:underline text-white bg-blue-400 shadow-md rounded-md py-2 w-1/2 text-center'
            >
              Login
            </Link>
            <Link
              to='/register'
              className='mr-2 hover:underline text-white bg-purple-400 shadow-md rounded-md py-2 w-1/2 text-center'
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarComponent;
