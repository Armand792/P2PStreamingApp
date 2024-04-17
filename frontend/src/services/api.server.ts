import {
  IConfirmPayment,
  ICreateStripIntent,
  ITransferToPlatformUser,
} from '@/interfaces/payments';
import { ILoginPayload, IRegisterPayload } from '@/interfaces/user.interface';
import axios, { AxiosResponse } from 'axios';
import { store } from '@/store/index';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${store.getState().user.auth.token}`,
  },
});

/**
 *
 * @description user request
 *
 */
export const register = async (payload: IRegisterPayload) => {
  return (await instance.post('/user/register', JSON.stringify(payload)))?.data;
};

export const login = async (payload: ILoginPayload) => {
  return (await instance.post('/user/login', JSON.stringify(payload)))?.data;
};

export const getUserDashBoardInformation = async () => {
  return (
    await instance.get('/user/user-dashboard-information', {
      headers: {
        Authorization: `Bearer ${store.getState().user.auth.token}`,
      },
    })
  )?.data;
};

export const getLiveSessionUsers = async () => {
  return (
    await instance.get('/user/live-session-users', {
      headers: {
        Authorization: `Bearer ${store.getState().user.auth.token}`,
      },
    })
  )?.data;
};

export const getPlatformUsers = async () => {
  return (
    await instance.get('/user/platform-users', {
      headers: {
        Authorization: `Bearer ${store.getState().user.auth.token}`,
      },
    })
  )?.data;
};

/**
 *
 * @description payment request
 *
 */

export const getUserTransactions = async () => {
  return (
    await instance.get('/payment/get-user-transaction', {
      headers: {
        Authorization: `Bearer ${store.getState().user.auth.token}`,
      },
    })
  )?.data;
};

export const createStripIntent = async (payload: ICreateStripIntent) => {
  return (
    await instance.post('/payment/create-intent', JSON.stringify(payload), {
      headers: {
        Authorization: `Bearer ${store.getState().user.auth.token}`,
      },
    })
  )?.data;
};

export const confirmPayment = async (payload: IConfirmPayment) => {
  return (
    await instance.post('/payment/confirm-payment', JSON.stringify(payload), {
      headers: {
        Authorization: `Bearer ${store.getState().user.auth.token}`,
      },
    })
  )?.data;
};

export const transferToPlatformUser = async (
  payload: ITransferToPlatformUser
) => {
  return (
    await instance.post(
      '/payment/transfer-to-platform-user',
      JSON.stringify(payload),
      {
        headers: {
          Authorization: `Bearer ${store.getState().user.auth.token}`,
        },
      }
    )
  )?.data;
};

export const updateOnlineStatus = async (payload: { islive: boolean }) => {
  return (
    await instance.post('/user/online-status', JSON.stringify(payload), {
      headers: {
        Authorization: `Bearer ${store.getState().user.auth.token}`,
      },
    })
  )?.data;
};
