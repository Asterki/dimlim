import axios from 'axios';

import type {
  LoginRequestBody,
  LoginResponseData,
  LogoutResponseData,
  FetchResponseData,
  RegisterRequestBody,
  RegisterResponseData,
} from '../../../../../shared/types/api/auth';

const fetchUser = async () => {
  try {
    const res = await axios.get<FetchResponseData>(`${import.meta.env.VITE_SERVER_HOST}/api/auth/check`, {
      withCredentials: true,
    });
    return res.data.user;
  } catch (error) {
    return null;
  }
};

const logout = async () => {
  try {
    await axios.get<LogoutResponseData>(`${import.meta.env.VITE_SERVER_HOST}/api/auth/logout`, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    return false;
  }
};

const login = async (emailOrUsername: string, password: string, tfaCode: string = '') => {
  try {
    const res = await axios.post<LoginResponseData>(
      `${import.meta.env.VITE_SERVER_HOST}/api/auth/login`,
      {
        emailOrUsername,
        password,
        tfaCode,
      } as LoginRequestBody,
      {
        withCredentials: true,
      },
    );
    return res.data.status;
  } catch (error) {
    return null;
  }
};

const register = async (email: string, password: string) => {
  try {
    const res = await axios.post<RegisterResponseData>(
      `${import.meta.env.VITE_SERVER_HOST}/api/auth/register`,
      {
        email,
        password,
      } as RegisterRequestBody,
      {
        withCredentials: true,
      },
    );
    return res.data.status;
  } catch (error) {
    return null;
  }
};

export { fetchUser, logout, login, register };
