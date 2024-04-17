/**
 * @file user service.
 */

import {
  IGetDashboardInformation,
  ILoginRequest,
  IRegistrationRequest,
  IResponse,
} from '../interfaces/user.interface';
import * as repo from '../repositories/user.repositories';

/**
 * Creates a new user.
 *
 * @returns Promise
 */
export const userRegistration = async (
  user: IRegistrationRequest
): Promise<IResponse | []> => {
  return await repo.userRegistration(user);
};

/**
 * Login user.
 *
 * @returns Promise
 */
export const userLogin = async (
  user: ILoginRequest
): Promise<IResponse | []> => {
  return await repo.userLogin(user);
};

/**
 * get user dashboard details
 *
 * @returns Promise
 */
export const getUserDashboardDetails = async (
  data: IGetDashboardInformation
): Promise<IResponse | []> => {
  return await repo.getUserDashboardInformation(data);
};

/**
 * get platform users
 *
 * @returns Promise
 */
export const getPlatformUser = async (): Promise<IResponse | []> => {
  return await repo.getPlatformUsers();
};

/**
 * Live session users.
 *
 * @returns Promise
 */
export const liveSessionUsers = async (): Promise<IResponse | []> => {
  return await repo.getLiveSessionUsers();
};

/**
 * update online status.
 *
 * @returns Promise
 */
export const updateOnlineStatus = async (data: {
  user_id: string;
  islive: boolean;
}): Promise<IResponse | []> => {
  return await repo.updateOnlineStatus(data);
};
