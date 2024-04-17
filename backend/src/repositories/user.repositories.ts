/**
 * @file User repository.
 */

import {
  IGetDashboardInformation,
  ILoginRequest,
  IRegistrationRequest,
  IResponse,
} from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import * as utils from '../utils/utils';
import { RequestError } from '../utils/errors';

/**
 * Creates a new user.
 *
 * @returns Promise
 */
export const userRegistration = async (
  user: IRegistrationRequest
): Promise<IResponse> => {
  try {
    const { email, password } = user;

    const existingUser = await UserModel.findUserEmail(email, ['user_id']); //

    const hashPassword = await utils.hashPassword(password);
    const id = uuidv4();

    if (existingUser.length > 0) {
      throw new RequestError({
        code: 400,
        message: 'User already exist',
      });
    }

    const userData = {
      email,
      password: hashPassword,
      user_id: id,
    };

    await UserModel.registerUser(userData);

    return {
      code: 200,
      message: 'successfully Registered',
      data: {
        email,
        user_id: id,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * User login
 * @return promise
 */
export const userLogin = async (payload: ILoginRequest): Promise<IResponse> => {
  try {
    const { email, password } = payload;

    const user = await UserModel.findUserEmail(email, [
      'password',
      'user_id',
      'user_email',
    ]);

    if (user.length === 0) {
      throw new RequestError({
        code: 400,
        message: 'User not found',
      });
    }

    const { password: hashedPassword, user_id, email: userEmail } = user[0];

    const isCorrect = await utils.comparePassword(password, hashedPassword);

    if (!isCorrect) {
      throw new RequestError({
        code: 400,
        message: 'Invalid credentials',
      });
    }

    const token = await utils.jwtToken({
      user_id,
      email: userEmail,
    });

    await UserModel.updateUser({ token }, ['token'], user_id);

    return {
      code: 200,
      message: 'login successfully',
      data: [
        {
          token,
          user_id,
        },
      ],
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get user dashboard details.
 *
 * @returns Promise
 */
export const getUserDashboardInformation = async (
  data: IGetDashboardInformation
): Promise<IResponse> => {
  try {
    const userWallet = await UserModel.findUserPaymentAccountById(
      data.user_id,
      ['wallet_balance']
    );

    const user = await UserModel.findUserById(data.user_id, [
      'user_email',
      'user_id',
    ]);

    return {
      code: 200,
      message: 'user dashboard details',
      data: {
        ...(userWallet?.length > 0 ? userWallet[0] : {}),
        ...(user.length > 0 ? user[0] : {}),
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get platform users.
 *
 * @returns Promise
 */
export const getPlatformUsers = async (): Promise<IResponse> => {
  try {
    const users = await UserModel.findAllUsers(['user_email', 'user_id']);

    return {
      code: 200,
      message: 'All platform users',
      data: {
        users,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get live session users.
 *
 * @returns Promise
 */
export const getLiveSessionUsers = async (): Promise<IResponse> => {
  try {
    const liveSessionUsers = await UserModel.findLiveSessionUsers([
      'user_id',
      'user_email',
    ]);
    console.log(liveSessionUsers);
    return {
      code: 200,
      message: 'live session users',
      data: liveSessionUsers ?? [],
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update online status.
 *
 * @returns Promise
 */
export const updateOnlineStatus = async ({
  user_id,
  islive,
}: {
  user_id: string;
  islive: boolean;
}): Promise<IResponse> => {
  try {
    await UserModel.updateUser({ islive }, ['islive'], user_id);
    return {
      code: 200,
      message: 'online status updated successfully',
      data: [],
    };
  } catch (error) {
    throw error;
  }
};
