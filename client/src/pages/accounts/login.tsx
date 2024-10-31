import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import NavbarComponent from '../../components/navbar';
import NotificationComponent from '../../components/notifications';

import { useAuth } from '../../features/auth';
import useNotification from '../../hooks/useNotification';

import TFADialog from '../../features/auth/components/TFADialogComponent';
import LoginForm from '../../features/auth/components/LoginFormComponent';

// To be later changed to a translate service
const messages = {
  'invalid-credentials': 'Invalid email/username or password',
  'requires-tfa': 'Two-factor authentication is required',
  'invalid-tfa-code': 'Invalid two-factor authentication code',
};

const AccountLogin = () => {
  const { user, authStatus, login } = useAuth();
  const { notification, showNotification } = useNotification();
  const redirect = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Dialog State
  const [tfaDialogOpen, setTFADialogOpen] = React.useState(false);

  const [loginLoading, setLoginLoading] = React.useState(false);

  const loginButtonPressed = async (emailOrUsername: string, password: string, tfaCode?: string) => {
    setLoginLoading(true);
    const result = await login(emailOrUsername, password, tfaCode);

    switch (result) {
      case 'success':
        redirect('/');
        break;
      case 'requires-tfa':
        // Since the TFA modal doesn't have access to the LoginForm state, we need to store the email/username and password in the component state
        setEmailOrUsername(emailOrUsername);
        setPassword(password);
        setTFADialogOpen(true);
        break;
      case 'invalid-credentials':
        showNotification('Failed to login', messages['invalid-credentials'], 'error');
        break;
      case 'invalid-tfa-code':
        showNotification('Failed to login', messages['invalid-tfa-code'], 'error');
        setTFADialogOpen(true);
        break;
      default:
        showNotification('Failed to login', 'An unknown error occurred', 'error');
        break;
    }

    setLoginLoading(false);
    setTFADialogOpen(false);
  };

  return (
    <div className='dark:bg-gray-800 bg-slate-200 min-h-screen dark:text-white text-neutral-700 bg-gradient-to-bl from-blue-400 to-purple-400 dark:from-gray-500 dark:to-gray-700'>
      <NavbarComponent user={null} />

      <NotificationComponent
        content={notification.content}
        title={notification.title}
        state={notification.state}
        type={notification.type}
      />

      <TFADialog open={tfaDialogOpen} onClose={() => setTFADialogOpen(false)} onSubmit={(tfaCode) => {
        loginButtonPressed(emailOrUsername, password, tfaCode);
      }} />

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-gray-700 bg-white/80 rounded-md shadow-md p-4 w-11/12 md:w-4/12'>
        <LoginForm loginLoading={loginLoading} onSubmit={loginButtonPressed} authState={authStatus} user={user} />
      </div>
    </div>
  );
};

export default AccountLogin;
