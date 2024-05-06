import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUser } from '../../store/slices/page';

import NavbarComponent from '../../components/navbar';
import { checkLoggedIn } from '../../lib/auth';

const IndexPage = () => {
  const user = useSelector((state: RootState) => state.page.currentUser);
  const dispatch = useDispatch();

  const redirect = useNavigate();

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
    <div className='dark:bg-gray-800 bg-white min-h-screen'>
      <NavbarComponent user={null} />

      <section className=''>
        <img
          src='/assets/images/bg-2.png'
          alt='Background'
          className='w-full h-screen overflow-y-hidden object-none shadow-md'
        />
        <div className='w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white flex items-center justify-center flex-col '>
          <img src='/assets/images/logo-no-background.png' alt='Logo' className='w-1/4 md:w-2/12 select-none' />
          <h1 className='text-5xl font-bold'>DIMLIM</h1> <br />
          <p className='m-0'>Open Source End-To-End Messaging Application</p>
          <div className='w-full mt-2 flex items-center justify-center flex-col md:flex-row'>
            <Link
              to='/login'
              className='text-center text-xl bg-neutral-400 opacity-95 p-4 rounded-md shadow-md w-8/12 my-2 transition-all hover:brightness-110 md:w-3/12 md:mx-2 md:my-0'
            >
              Login
            </Link>
            <Link
              to='/register'
              className='text-center text-xl bg-blue-400 opacity-95 p-4 rounded-md shadow-md w-8/12 my-2 transition-all hover:brightness-110 md:w-3/12 md:mx-2 md:my-0'
            >
              Register
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndexPage;
