import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store'; // Adjust the path as necessary
import { setUser, setAuthStatus, setError } from '../slices/auth'; // Adjust the path as necessary
import authApi from '../services/authApi'; // Adjust the path as necessary

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const authStatus = useSelector((state: RootState) => state.auth.authStatus);
  const error = useSelector((state: RootState) => state.auth.error);

  const login = async (emailOrUsername: string, password: string, tfaCode: string = '') => {
    dispatch(setAuthStatus('loading'));
    
    try {
      const status = await authApi.login(emailOrUsername, password, tfaCode);
      if (status === 'success') {
        const currentUser = await authApi.fetchUser();
        dispatch(setUser(currentUser!));
        dispatch(setAuthStatus('authenticated'));
      } else {
        dispatch(setError('Login failed'));
        dispatch(setAuthStatus('unauthenticated'));
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setError(err.message));
      } else {
        dispatch(setError('An unknown error occurred'));
      }
      dispatch(setAuthStatus('error'));
    }
  };

  const logout = async () => {
    await authApi.logout();
    dispatch(setUser(null));
    dispatch(setAuthStatus('unauthenticated'));
  };

  const checkAuth = async () => {
    const currentUser = await authApi.fetchUser();
    if (currentUser) {
      dispatch(setUser(currentUser));
      dispatch(setAuthStatus('authenticated'));
    } else {
      dispatch(setAuthStatus('unauthenticated'));
    }
  };

  useEffect(() => {
    checkAuth(); // Check authentication status on component mount
  }, []);

  return { user, authStatus, error, login, logout };
};

export default useAuth;
