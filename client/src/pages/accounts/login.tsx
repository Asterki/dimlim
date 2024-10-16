import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { motion } from 'framer-motion';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUser } from '../../store/slices/page';

import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUserCircle, HiEye, HiEyeOff } from 'react-icons/hi';
import { FaSpinner } from 'react-icons/fa';

import NavbarComponent from '../../components/navbar';
import NotificationComponent from '../../components/notifications';
import * as Dialog from '@radix-ui/react-dialog';

import { LoginResponseData } from '../../../../shared/types/api/accounts';
import { checkLoggedIn } from '../../lib/auth';

// To be later changed to a translate service
const messages = {
  'invalid-credentials': 'Invalid email/username or password',
  'requires-tfa': 'Two-factor authentication is required',
  'invalid-tfa-code': 'Invalid two-factor authentication code',
};

const AccountLogin = () => {
  const user = useSelector((state: RootState) => state.page.currentUser);
  const dispatch = useDispatch();
  const redirect = useNavigate();

  // Notification state
  const [notification, setNotification] = React.useState<{
    state: 'showing' | 'hidden';
    title: string;
    content: string;
    type: 'error' | 'success' | 'info' | 'warning';
  }>({
    state: 'hidden',
    title: '',
    content: '',
    type: 'info',
  });

  const showNotification = (title: string, content: string, type: 'warning' | 'info' | 'success' | 'error') => {
    setNotification({
      state: 'showing',
      title: title,
      content: content,
      type: type,
    });

    setTimeout(() => {
      setNotification({
        state: 'hidden',
        title: '',
        content: '',
        type: 'info',
      });
    }, 5000);
  };

  // Dialog State
  const [tfaDialogOpen, setTFADialogOpen] = React.useState(false);

  const [loginLoading, setLoginLoading] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const usernameEmailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const tfaCodeRef = React.useRef<HTMLInputElement>(null);

  const login = async () => {
    const emailOrUsername = usernameEmailRef.current!.value;
    const password = passwordRef.current!.value;
    const tfaCode = tfaCodeRef.current ? tfaCodeRef.current.value : '';

    setLoginLoading(true);

    try {
      const response: AxiosResponse<LoginResponseData> = await axios.post(
        `${import.meta.env.VITE_SERVER_HOST}/api/accounts/login`,
        {
          emailOrUsername,
          password,
          tfaCode: tfaCode,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.status === 'success') {
        showNotification('Logged in successfully', 'You have been logged in successfully', 'success');

        const serverUser = await checkLoggedIn();
        if (serverUser) dispatch(setUser(serverUser));
        redirect('/home');
      } else if (response.data.status === 'requires-tfa') {
        setTFADialogOpen(true);
      } else {
        showNotification('Failed to login', messages[response.data.status as keyof typeof messages], 'error');
      }
    } catch (err) {
      showNotification('Failed to login', 'Unable to login at the moment. Please try again later.', 'error');
    }

    setLoginLoading(false);
  };

  // Login-protect the page
  React.useEffect(() => {
    (async () => {
      if (!user) {
        const currentUser = await checkLoggedIn();
        if (currentUser) {
          dispatch(setUser(currentUser));
          return redirect('/home');
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='dark:bg-gray-800 bg-slate-200 min-h-screen dark:text-white text-neutral-700 bg-gradient-to-bl from-blue-400 to-purple-400 dark:from-gray-500 dark:to-gray-700'>
      <NavbarComponent user={null} />

      <NotificationComponent
        content={notification.content}
        title={notification.title}
        state={notification.state}
        type={notification.type}
      />

      <Dialog.Root
        onOpenChange={(state) => {
          if (state) {
            tfaCodeRef.current?.focus();
          } else {
            setTFADialogOpen(false);
          }
        }}
        open={tfaDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className='bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-20' />
          <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md dark:bg-gray-700 bg-slate-100 p-4 dark:text-white text-slate-700 focus:outline-none z-30 flex items-center flex-col gap-2'>
            <h1 className='text-2xl'>
              <HiOutlineUserCircle className='inline-block' />
              TFA Code
            </h1>
            <input
              type='password'
              className='dark:bg-gray-800 bg-slate-200 rounded-md p-2 dark:text-white w-full'
              placeholder='Code generated by your authenticator app'
              ref={tfaCodeRef}
            />
            <button className='p-2 bg-blue-400 rounded-md mt-2 w-1/2 text-white' onClick={login}>
              Submit
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-gray-700 bg-white/80 rounded-md shadow-md p-4 w-11/12 md:w-4/12'>
        <motion.form
          variants={{
            hidden: { opacity: 0, y: -50 },
            showing: { opacity: 1, y: 0 },
          }}
          initial='hidden'
          animate='showing'
          transition={{ duration: 0.5 }}
        >
          <div className='flex flex-col items-center gap-2'>
            <img src='/assets/images/logo-no-background.png' className='w-8' />
            <h1 className='text-xl font-semibold mb-2'>Login to DIMLIM</h1>
          </div>

          <label className='font-bold'>
            <HiOutlineMail className='inline-block' />
            Email
          </label>
          <div className='relative'>
            <input
              type='email'
              placeholder='email@example.com'
              ref={usernameEmailRef}
              className='w-full p-2 dark:bg-gray-800 border-2 dark:border-gray-600 border-slate-200  outline-none rounded-md transition-all focus:!border-blue-400 hover:border-slate-300 dark:hover:border-gray-500'
            />
          </div>

          <br />

          <label className='font-bold'>
            <HiOutlineLockClosed className='inline-block' />
            Password
          </label>
          <div className='relative'>
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder='••••••••'
              ref={passwordRef}
              className='w-full p-2 dark:bg-gray-800 border-2 dark:border-gray-600 border-slate-200  outline-none rounded-md transition-all focus:!border-blue-400 hover:border-slate-300 dark:hover:border-gray-500'
            />

            <button
              className='absolute right-4 top-1/2 -translate-y-1/2'
              type='button'
              onClick={() => {
                setPasswordVisible(!passwordVisible);
              }}
            >
              {passwordVisible ? <HiEye /> : <HiEyeOff />}
            </button>
          </div>

          <div className='mt-8'>
            <button
              type='button'
              onClick={login}
              className='w-full p-2 bg-blue-400 hover:bg-purple-400 rounded-md text-white shadow-md shadow-blue-300 hover:shadow-lg hover:shadow-purple-300 transition-all dark:shadow-none dark:hover:shadow-none'
            >
              {loginLoading && <FaSpinner className='animate-spin inline-block' />}
              Login
            </button>
          </div>

          <div className='mt-4'>
            Don't have an account yet?{' '}
            <Link to='/register' className='text-blue-400 hover:text-purple-400 transition-all'>
              Register
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AccountLogin;
