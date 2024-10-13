import * as React from 'react';
import validator from 'validator';
import axios from 'axios';

import * as Dialog from '@radix-ui/react-dialog';
import QRCode from 'qrcode';

interface SectionProps {
  setTFAActive: (active: boolean) => void;
  TFAActive: boolean;
  showNotification: (title: string, message: string, type: 'success' | 'warning' | 'error') => void;
}

const SettingsSecuritySection: React.FC<SectionProps> = (props) => {
  // Modals state
  const [passwordModalOpen, setPasswordModalOpen] = React.useState(false);
  const [tfaModalOpen, setTfaModalOpen] = React.useState(false);

  // Change password
  const oldPasswordInput = React.useRef<HTMLInputElement>(null);
  const newPasswordInput = React.useRef<HTMLInputElement>(null);
  const confirmNewPasswordInput = React.useRef<HTMLInputElement>(null);

  // TFA
  const tfaCodeInput = React.useRef<HTMLInputElement>(null);
  const tfaEnablePasswordInput = React.useRef<HTMLInputElement>(null);
  const tfaDisablePasswordInput = React.useRef<HTMLInputElement>(null);

  const [secret, setSecret] = React.useState({
    ascii: '',
    base32: '',
    hex: '',
    otpauth_url: '',
    image: '',
  });

  // TFA Functions
  const generateSecret = async () => {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_HOST}/api/utils/generate-tfa`);
    if (response.data.status === 'success') {
      QRCode.toDataURL(response.data.data.otpauth_url, (err, url) => {
        if (err) console.error(err);
        setSecret({
          ...response.data.data,
          image: url,
        });
      });
    }
  };

  const activateTFA = async () => {
    const code = tfaCodeInput.current?.value;

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_HOST}/api/utils/verify-tfa`,
      {
        code,
        secret: secret.base32,
      },
      {
        withCredentials: true,
      },
    );
    if (response.data.status === 'success') {
      const password = tfaEnablePasswordInput.current?.value;

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_HOST}/api/settings/security/tfa`,
        {
          password,
          action: 'activate',
          secret: secret.base32,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.status === 'success') {
        props.setTFAActive(true);
        setTfaModalOpen(false);
        props.showNotification(
          'Two factor authentication enabled',
          'Two factor authentication has been enabled successfully',
          'success',
        );
      } else {
        console.log(response.data.status);
      }
    }
  };

  const deactivateTFA = async () => {
    const password = tfaDisablePasswordInput.current?.value;
    console.log(password);

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_HOST}/api/settings/security/tfa`,
      {
        password: password,
        action: 'deactivate',
        secret: secret.base32,
      },
      {
        withCredentials: true,
      },
    );

    if (response.data.status === 'success') {
      props.setTFAActive(false);
      setTfaModalOpen(false);
      props.showNotification(
        'Two factor authentication disabled',
        'Two factor authentication has been disabled successfully',
        'warning',
      );
    } else {
      console.log(response.data.status);
    }
  };

  // Password functions
  const changePassword = async () => {
    const newPassword = newPasswordInput.current?.value as string;
    const confirmPassword = confirmNewPasswordInput.current?.value as string;
    const oldPassword = oldPasswordInput.current?.value as string;

    if (newPassword !== confirmPassword) {
      return props.showNotification(
        'Passwords do not match',
        'The new password and the confirmation password do not match',
        'error',
      );
    }

    if (!validator.isStrongPassword(newPassword)) {
      return props.showNotification(
        'Password not strong enough',
        'The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
        'error',
      );
    }

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_HOST}/api/settings/security/change-password`,
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        withCredentials: true,
      },
    );

    if (response.data.status === 'success') {
      setPasswordModalOpen(false);
      props.showNotification('Password changed', 'Your password has been changed successfully', 'success');
    } else {
      console.log(response.data.status);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-2'>
        <Dialog.Root
          onOpenChange={(state) => {
            if (state) {
              oldPasswordInput.current?.focus();
            } else {
              setPasswordModalOpen(false);
            }
          }}
          open={passwordModalOpen}
        >
          <Dialog.Trigger
            onClick={() => setPasswordModalOpen(true)}
            className='w-1/2 rounded-md bg-blue-400 p-2 text-white shadow-md md:w-3/12'
          >
            Change password
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className='bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-20' />
            <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md dark:bg-gray-700 bg-slate-100 p-4 dark:text-white text-slate-700 focus:outline-none z-30 flex items-center flex-col gap-2'>
              <h1 className='text-2xl'>Change Password</h1>
              <input
                type='password'
                className='w-full rounded-md p-2 dark:bg-gray-800 dark:text-white'
                placeholder='Current Password'
                ref={oldPasswordInput}
              />
              <input
                type='password'
                className='w-full rounded-md p-2 dark:bg-gray-800 dark:text-white'
                placeholder='New Password'
                ref={newPasswordInput}
              />
              <input
                type='password'
                className='w-full rounded-md p-2 dark:bg-gray-800 dark:text-white'
                placeholder='Confirm New Password'
                ref={confirmNewPasswordInput}
              />
              <button className='mt-2 w-1/2 rounded-md bg-blue-400 p-2 text-white' onClick={changePassword}>
                Submit
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <p>Last Changed: {new Date(Date.now()).toString()}</p>
      </div>

      <div className='flex items-center gap-2'>
        <Dialog.Root
          open={tfaModalOpen}
          onOpenChange={(state) => {
            if (state) {
              generateSecret().then((r) => r);
            } else {
              setTfaModalOpen(false);
            }
          }}
        >
          <Dialog.Trigger
            onClick={() => setTfaModalOpen(true)}
            className='w-1/2 rounded-md bg-blue-400 p-2 text-white shadow-md md:w-3/12'
          >
            Two Factor Authentication
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className='bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-20' />
            {!props.TFAActive && (
              <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md dark:bg-gray-700 bg-slate-200 text-slate-700 p-4 dark:text-white focus:outline-none z-30 flex flex-col items-center'>
                <h1 className='text-2xl'>Scan with your device</h1>
                <img src={secret.image} alt='' />
                <input
                  type='text'
                  value={secret.base32}
                  readOnly
                  className='my-2 w-full rounded-md p-2 dark:bg-gray-800'
                />

                <p className='text-center'>Scan the QR code with your device to enable two factor authentication</p>

                <input
                  type='text'
                  ref={tfaCodeInput}
                  className='w-full rounded-md p-2 dark:bg-gray-800 dark:text-white'
                  placeholder='Code Generated by your app'
                />

                <input
                  type='password'
                  ref={tfaEnablePasswordInput}
                  className='mt-2 w-full rounded-md p-2 dark:bg-gray-800 dark:text-white'
                  placeholder='Your password'
                />

                <button className='mt-2 w-1/2 rounded-md bg-blue-400 p-2 text-white' onClick={activateTFA}>
                  Submit
                </button>
              </Dialog.Content>
            )}
            {props.TFAActive && (
              <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md dark:bg-gray-700 p-4 text-white focus:outline-none z-30 flex flex-col items-center'>
                <h1 className='text-2xl'>Disable TFA</h1>

                <input
                  type='text'
                  ref={tfaDisablePasswordInput}
                  className='w-full rounded-md p-2 text-white dark:bg-gray-800'
                  placeholder='Your password'
                />
                <button className='mt-2 w-1/2 rounded-md bg-blue-400 p-2' onClick={deactivateTFA}>
                  Submit
                </button>
              </Dialog.Content>
            )}
          </Dialog.Portal>
        </Dialog.Root>
        <p>Status: {props.TFAActive ? 'Active' : 'Inactive'}</p>
      </div>
    </div>
  );
};

export default SettingsSecuritySection;
