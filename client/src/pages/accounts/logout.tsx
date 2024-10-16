import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUser } from '../../store/slices/page';

import NavbarComponent from '../../components/navbar';
import NotificationComponent from '../../components/notifications';

import { checkLoggedIn } from '../../lib/auth';

const AccountLogout = () => {
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

  const logout = async () => {
    axios
      .get(`${import.meta.env.VITE_SERVER_HOST}/api/accounts/logout`, {
        withCredentials: true,
      })
      .then(async () => {
        showNotification('Logged out', 'You have been logged out', 'success');
        dispatch(setUser(null));

        setTimeout(() => {
          redirect('/login');
        }, 3000);
      });
  };

  React.useEffect(() => {
    (async () => {
      if (!user) {
        const currentUser = await checkLoggedIn();
        if (currentUser) return dispatch(setUser(currentUser));
        redirect('/login');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={user?.preferences.general.theme == 'dark' ? 'dark' : ''}>
      <div className='dark:bg-gray-800 bg-slate-200 min-h-screen dark:text-white text-slate-700 bg-gradient-to-bl from-blue-400 to-purple-400 dark:from-gray-500 dark:to-gray-700'>
        <NotificationComponent
          content={notification.content}
          title={notification.title}
          state={notification.state}
          type={notification.type}
        />

        {user && (
          <div>
            <NavbarComponent user={user} />

            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-gray-700 bg-slate-100 shadow-md rounded-md p-4 w-11/12 md:w-4/12'>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -50 },
                  showing: { opacity: 1, y: 0 },
                }}
                initial='hidden'
                animate='showing'
                transition={{ duration: 0.5 }}
              >
                <h1 className='text-2xl font-semibold mb-2'>Are you sure you want to log out?</h1>

                <p>You will be logged out of your account and will have to log back in to access your account.</p>

                <button
                  onClick={logout}
                  className='w-full bg-red-400 text-white rounded-md p-2 mt-4 hover:brightness-125 transition-all'
                >
                  Logout
                </button>

                <Link
                  to='/home'
                  className='text-center w-full block dark:bg-gray-500 bg-slate-500 text-white rounded-md p-2 mt-4 hover:brightness-125 transition-all'
                >
                  Cancel
                </Link>
              </motion.div>
            </div>
          </div>
        )}
        {!user && (
          <div>
            <h1>Authenticating</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountLogout;
