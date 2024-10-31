import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setUser } from '../store/slices/page';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../shared/types/models';
import { useCallback } from 'react';

const useAuthService = () => {
  const user = useSelector((state: RootState) => state.page.currentUser);
  const dispatch = useDispatch();
  const redirect = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_HOST}/api/auth/check`, {
        withCredentials: true,
      });
      return res.data.user;
    } catch (error) {
      return null;
    }
  }, []);

  const checkAuth = useCallback(async (required = false) => {
    if (user) return { status: 'authenticated', user };
    const currentUser = await fetchUser();
    if (currentUser) {
      dispatch(setUser(currentUser));
      return { status: 'authenticated', user: currentUser };
    } else if (required) {
      redirect('/login');
    }
    return { status: 'unauthenticated', user: null };
  }, [user, fetchUser, redirect, dispatch]);

  const logout = useCallback(async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_HOST}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUser(null));
      redirect('/login');
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, redirect]);

  return { checkAuth, fetchUser, logout };
};

export default useAuthService;
