/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import * as Tabs from '@radix-ui/react-tabs';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUser } from '../../store/slices/page';

import NavbarComponent from '../../components/navbar';
import NotificationComponent from '../../components/notifications';
import { checkLoggedIn } from '../../lib/auth';

// Icons
import { AiOutlineSetting, AiOutlineUser, AiOutlineBell, AiOutlineLock, AiOutlineSafety } from 'react-icons/ai';

// Sections
import SettingsGeneralSection from './general';
import SettingsProfileSection from './profile';
import SettingsNotificationSection from './notifications';
import SettingsPrivacySection from './privacy';
import SettingsSecuritySection from './security';

const SettingsIndex = () => {
  const user = useSelector((state: RootState) => state.page.currentUser);
  const dispatch = useDispatch();

  const redirect = useNavigate();
  React.useEffect(() => {
    (async () => {
      if (!user) {
        const currentUser = await checkLoggedIn();
        if (currentUser) dispatch(setUser(currentUser));
        else return redirect('/login');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const page = React.useRef<HTMLDivElement>(null);

  const [tab, setTab] = React.useState('tab1');
  const [userLoaded, setUserLoaded] = React.useState(false);

  // Settings
  const [generalSettings, setGeneralSettings] = React.useState({
    theme: 'light',
    language: 'en',
  });

  const [notificationsSettings, setNotificationsSettings] = React.useState({
    showNotifications: true,
    playSound: true,
  });

  const [privacySettings, setPrivacySettings] = React.useState({
    showOnlineStatus: true,
    showLastSeen: true,
    showReadReceipts: true,
  });

  const [TFAActive, setTFAActive] = React.useState(false);

  // Other methods
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

  // Update the user preferences when the settings change
  React.useEffect(() => {
    if (user && userLoaded) {
      dispatch(
        setUser({
          ...user,
          preferences: {
            ...user.preferences,
            general: generalSettings,
          },
        }),
      );

      (async () => {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_HOST}/api/settings/general`,
          {
            ...generalSettings,
          },
          { withCredentials: true },
        );

        console.log(response);
      })();
    }
  }, [generalSettings]);

  React.useEffect(() => {
    if (user && userLoaded) {
      dispatch(
        setUser({
          ...user,
          preferences: {
            ...user.preferences,
            notifications: notificationsSettings,
          },
        }),
      );

      (async () => {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_HOST}/api/settings/notifications`,
          {
            ...notificationsSettings,
          },
          { withCredentials: true },
        );

        console.log(response);
      })();
    }
  }, [notificationsSettings]);

  React.useEffect(() => {
    if (user && userLoaded) {
      dispatch(
        setUser({
          ...user,
          preferences: {
            ...user.preferences,
            privacy: privacySettings,
          },
        }),
      );

      console.log(privacySettings);

      (async () => {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_HOST}/api/settings/privacy`,
          {
            ...privacySettings,
          },
          { withCredentials: true },
        );

        console.log(response);
      })();
    }
  }, [privacySettings]);

  // Load the user preferences when the user is loaded
  React.useEffect(() => {
    if (user) {
      console.log(user.preferences.general);
      setGeneralSettings(user.preferences.general);
      setNotificationsSettings(user.preferences.notifications);
      setPrivacySettings(user.preferences.privacy);
      setTFAActive(user.preferences.security.twoFactor.active);

      setUserLoaded(true);
    }
  }, [user]);

  return (
    <div className={user?.preferences.general.theme == 'dark' ? 'dark' : ''} ref={page}>
      <div className='min-h-screen bg-slate-200 text-neutral-700 dark:bg-gray-800 dark:text-white'>
        {user && (
          <div>
            <NavbarComponent user={user} />

            <NotificationComponent
              content={notification.content}
              title={notification.title}
              state={notification.state}
              type={notification.type}
            />

            <div className='pt-20'>
              <div className='flex items-center justify-center text-center'>
                <Tabs.Root
                  className='flex w-11/12 flex-col items-center justify-center text-center md:w-8/12'
                  defaultValue='tab1'
                  onValueChange={(e) => {
                    setTab(e);
                  }}
                >
                  <Tabs.List
                    className='flex w-full justify-self-center border-b-2 shadow-md dark:border-gray-800'
                    aria-label='Manage your account'
                  >
                    <Tabs.Trigger
                      className={`flex items-center gap-2 p-2 rounded-tl-md transition-all w-3/12 md:w-1/4 border-r-2 dark:border-gray-800 ${
                        tab == 'tab1'
                          ? 'bg-blue-400 shadow-2xl z-20 text-white'
                          : 'dark:bg-gray-700 bg-slate-100 hover:brightness-125'
                      }`}
                      value='tab1'
                    >
                      <AiOutlineSetting className='text-xl' />
                      General
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      className={`flex items-center gap-2 p-2 transition-all w-3/12 md:w-1/4 border-r-2 dark:border-gray-800 ${
                        tab == 'tab2'
                          ? 'bg-blue-400 shadow-2xl z-20 text-white'
                          : 'dark:bg-gray-700 bg-slate-100 hover:brightness-125'
                      }`}
                      value='tab2'
                    >
                      <AiOutlineUser className='text-xl' />
                      Profile
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      className={`flex items-center gap-2 p-2 transition-all w-3/12 md:w-1/4 border-r-2 dark:border-gray-800 ${
                        tab == 'tab3'
                          ? 'bg-blue-400 shadow-2xl z-20 text-white'
                          : 'dark:bg-gray-700 bg-slate-100 hover:brightness-125'
                      }`}
                      value='tab3'
                    >
                      <AiOutlineBell className='text-xl' />
                      Notifications
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      className={`flex items-center gap-2 p-2 transition-all w-3/12 md:w-1/4 ${
                        tab == 'tab4'
                          ? 'bg-blue-400 shadow-2xl z-20 text-white'
                          : 'dark:bg-gray-700 bg-slate-100 hover:brightness-125'
                      }`}
                      value='tab4'
                    >
                      <AiOutlineLock className='text-xl' />
                      Privacy
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      className={`flex items-center gap-2 p-2 transition-all w-3/12 rounded-tr-md  md:w-1/4 border-l-2 dark:border-gray-800 ${
                        tab == 'tab5'
                          ? 'bg-blue-400 shadow-2xl z-20 text-white'
                          : 'dark:bg-gray-700 bg-slate-100 hover:brightness-125'
                      }`}
                      value='tab5'
                    >
                      <AiOutlineSafety className='text-xl' />
                      Security
                    </Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content
                    className='w-full rounded-br-md rounded-bl-md bg-slate-100 p-2 text-center shadow-md dark:bg-gray-700'
                    value='tab1'
                  >
                    <SettingsGeneralSection
                      generalSettings={generalSettings}
                      setGeneralSettings={setGeneralSettings}
                      page={page}
                    />
                  </Tabs.Content>
                  <Tabs.Content
                    className='w-full rounded-br-md rounded-bl-md bg-slate-100 p-2 text-center shadow-md dark:bg-gray-700'
                    value='tab2'
                  >
                    <SettingsProfileSection page={page} user={user} />
                  </Tabs.Content>
                  <Tabs.Content
                    className='w-full rounded-br-md rounded-bl-md bg-slate-100 p-2 text-center shadow-md dark:bg-gray-700'
                    value='tab3'
                  >
                    <SettingsNotificationSection
                      notificationsSettings={notificationsSettings}
                      setNotificationsSettings={setNotificationsSettings}
                    />
                  </Tabs.Content>
                  <Tabs.Content
                    className='w-full rounded-br-md rounded-bl-md bg-slate-100 p-2 text-center shadow-md dark:bg-gray-700'
                    value='tab4'
                  >
                    <SettingsPrivacySection privacySettings={privacySettings} setPrivacySettings={setPrivacySettings} />
                  </Tabs.Content>
                  <Tabs.Content
                    className='w-full rounded-br-md rounded-bl-md bg-slate-100 p-2 text-center shadow-md dark:bg-gray-700'
                    value='tab5'
                  >
                    <SettingsSecuritySection
                      TFAActive={TFAActive}
                      setTFAActive={setTFAActive}
                      showNotification={showNotification}
                    />
                  </Tabs.Content>
                </Tabs.Root>
              </div>
            </div>
          </div>
        )}
        {!user && <div>Loading...</div>}
      </div>
    </div>
  );
};

export default SettingsIndex;
