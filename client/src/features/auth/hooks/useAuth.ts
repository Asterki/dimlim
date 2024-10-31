/**
 * useAuth Hook
 *
 * This hook provides authentication functionalities including:
 * - Registering a new user
 * - Logging in a user
 * - Logging out the current user
 * - Checking if the user is authenticated on component mount
 *
 * It uses Redux for state management and dispatches actions to update the authentication state.
 *
 * Functions:
 * - register: Registers a new user and updates the state accordingly.
 * - login: Logs in a user and updates the state accordingly.
 * - logout: Logs out the current user and updates the state accordingly.
 * - checkAuth: Checks if the user is authenticated on component mount.
 *
 * State:
 * - user: The current authenticated user.
 * - authStatus: The authentication status ('authenticated', 'unauthenticated', 'loading', 'error').
 *
 * Usage:
 * const { user, authStatus, login, logout, register } = useAuth();
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store'; // Adjust the path as necessary
import { setUser, setAuthStatus } from '../slices/auth'; // Adjust the path as necessary
import authApi from '../services/authApi'; // Adjust the path as necessary

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const authStatus = useSelector((state: RootState) => state.auth.authStatus);

  // Sends a request to the server to register a new user
  const register = async (username: string, email: string, password: string) => {
    dispatch(setAuthStatus('loading'));

    try {
      const status = await authApi.register(username, email, password);
      if (status === 'success') {
        const currentUser = await authApi.fetchUser();
        dispatch(setUser(currentUser!));
        dispatch(setAuthStatus('authenticated'));
        return "success"
      } else {
        dispatch(setAuthStatus('unauthenticated'));
        return status || 'unknown-error';
      }
    } catch (err) {
      dispatch(setAuthStatus('error'));
      return 'unknown-error';
    }
  };

  // Sends a request to the server to log in a user
  const login = async (emailOrUsername: string, password: string, tfaCode: string = '') => {
    dispatch(setAuthStatus('loading'));

    try {
      const status = await authApi.login(emailOrUsername, password, tfaCode);
      if (status === 'success') {
        // Set the user to the state
        const currentUser = await authApi.fetchUser();
        dispatch(setUser(currentUser!));
        dispatch(setAuthStatus('authenticated'));
        return 'success';
      } else {
        dispatch(setAuthStatus('unauthenticated'));
        return status ?? 'unknown-error';
      }
    } catch (err) {
      dispatch(setAuthStatus('error'));
      return 'unknown-error';
    }
  };

  // Sends a request to the server to log out the current user
  const logout = async () => {
    const result = await authApi.logout();
    dispatch(setUser(null)); // Remove the user from the state
    dispatch(setAuthStatus('unauthenticated'));
    return result
  };

  // Checks if the user is authenticated on component mount
  const checkAuth = async () => {
    if (user) return;
    const currentUser = await authApi.fetchUser();
    console.log(currentUser)
    if (currentUser) {
      dispatch(setUser(currentUser)); // Set the user to the state
      dispatch(setAuthStatus('authenticated'));
    } else {
      dispatch(setAuthStatus('unauthenticated'));
    }
  };

  useEffect(() => {
    checkAuth(); // Check authentication status on component mount only if the user is not authenticated
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, authStatus, login, logout, register };
};

export default useAuth;
