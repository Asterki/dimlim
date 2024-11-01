import * as React from 'react';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import validator from 'validator';

import RegisterForm from '../../features/auth/components/RegisterFormComponent';

import useNotification from '../../hooks/useNotification';
import useAuth from '../../features/auth/hooks/useAuth';
import PageLayout from '../../layouts/PageLayout';

const AccountRegister = () => {
  const { notification, showNotification } = useNotification();
  const { user, authStatus, register } = useAuth();
  const redirect = useNavigate();

  // Visibility status
  const [registerLoading, setRegisterLoading] = React.useState(false);

  const registerButtonPressed = async (email: string, username: string, password: string, repeatPassword: string) => {
    const parsedBody = z
      .object({
        email: z.string().email(),
        username: z
          .string()
          .min(3, { message: 'Username must be at least 3 characters long' })
          .max(24 , { message: 'Username must be at most 24 characters long' })
          .refine((username) => {
            return validator.isAlphanumeric(username, 'en-US', { ignore: '_.' });
          }, { message: 'Username must be alphanumeric' }),
        password: z
          .string()
          .min(8, { message: 'Password must be at least 8 characters long' })
          .max(100, { message: 'Password must be at most 100 characters long' })
          .refine((pass) => {
            return validator.isStrongPassword(pass);
          }, { message: 'Password must be strong' }),
        repeatPassword: z.string().refine((repeatPassword) => {
          return repeatPassword === password;
        }, { message: 'Passwords do not match' }),
      })
      .safeParse({
        email,
        username,
        password,
        repeatPassword,
      });

    setRegisterLoading(true);

    if (!parsedBody.success) {
      showNotification('Failed to register', JSON.parse(parsedBody.error.message)[0].message, 'error');
      setRegisterLoading(false);
      return;
    }

    const result = await register(parsedBody.data.username, parsedBody.data.email, parsedBody.data.password);
    switch (result) {
      case 'success':
        showNotification('Successfully registered', 'You have successfully registered', 'success');
        redirect('/home');
        break;
      case 'user-exists':
        showNotification('Failed to register', 'Email/Username is already taken', 'error');
        break;
      default:
        showNotification('Failed to register', 'An unexpected error occurred', 'error');
        break;
    }

    setRegisterLoading(false);
  };

  return (
    <PageLayout notification={notification} className='dark:bg-gray-800 bg-slate-200 min-h-screen dark:text-white text-slate-700 bg-gradient-to-bl from-blue-400 to-purple-400 dark:from-gray-500 dark:to-gray-700'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-gray-700 bg-slate-100 rounded-md p-4 w-11/12 md:w-4/12 shadow-md'>
        <RegisterForm
          authStatus={authStatus}
          registerLoading={registerLoading}
          onSubmit={registerButtonPressed}
          user={user}
        />

        <div className='mt-4'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-400 hover:text-purple-400 transition-all'>
            Login
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default AccountRegister;
