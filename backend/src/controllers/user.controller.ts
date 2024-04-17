import { Request, Response } from 'express';
import * as apiUtils from '../utils/utils';
import * as userServices from '../services/user.services';
import { DataBaseError, RequestError } from '../utils/errors';

/**
 * Post handler.
 *
 * @param  {Request} req
 * @param  {Response} res
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const payload = {
      email,
      password,
    };
    const registration_information =
      await userServices.userRegistration(payload);

    res
      .status(200)
      .json(apiUtils.buildSuccessResponse(registration_information));
  } catch (error) {
    if (error instanceof DataBaseError) {
      return res
        .status(422)
        .json(apiUtils.buildErrorResponse(['Database error']));
    } else if (error instanceof RequestError) {
      return res
        .status(error.code ?? 200)
        .json(apiUtils.buildErrorResponse(error));
    } else {
      return res
        .status(500)
        .json(apiUtils.buildErrorResponse(['Server error']));
    }
  }
};

/**
 * Post handler.
 *
 * @param  {Request} req
 * @param  {Response} res
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const payload = {
      email,
      password,
    };
    const login_information = await userServices.userLogin(payload);

    res.status(200).json(apiUtils.buildSuccessResponse(login_information));
  } catch (error) {
    if (error instanceof DataBaseError) {
      return res
        .status(422)
        .json(apiUtils.buildErrorResponse(['Server error']));
    } else if (error instanceof RequestError) {
      return res
        .status(error.code ?? 200)
        .json(apiUtils.buildErrorResponse(error));
    } else {
      return res
        .status(500)
        .json(apiUtils.buildErrorResponse(['Server error']));
    }
  }
};

/**
 * Post handler.
 *
 * @param  {Request} req
 * @param  {Response} res
 */
export const getDashboardInformation = async (
  req: Request | any,
  res: Response
) => {
  try {
    const payload = {
      user_id: req?.user?.user_id ?? '',
    };
    const user_information =
      await userServices.getUserDashboardDetails(payload);

    res.status(200).json(apiUtils.buildSuccessResponse(user_information));
  } catch (error) {
    if (error instanceof DataBaseError) {
      return res
        .status(422)
        .json(apiUtils.buildErrorResponse(['Server error']));
    } else if (error instanceof RequestError) {
      return res
        .status(error.code ?? 200)
        .json(apiUtils.buildErrorResponse(error));
    } else {
      return res
        .status(500)
        .json(apiUtils.buildErrorResponse(['Server error']));
    }
  }
};

/**
 * Post handler.
 *
 * @param  {Request} req
 * @param  {Response} res
 */
export const getPlatformUsers = async (req: Request | any, res: Response) => {
  try {
    const users_information = await userServices.getPlatformUser();

    res.status(200).json(apiUtils.buildSuccessResponse(users_information));
  } catch (error) {
    if (error instanceof DataBaseError) {
      return res
        .status(422)
        .json(apiUtils.buildErrorResponse(['Server error']));
    } else if (error instanceof RequestError) {
      return res
        .status(error.code ?? 200)
        .json(apiUtils.buildErrorResponse(error));
    } else {
      return res
        .status(500)
        .json(apiUtils.buildErrorResponse(['Server error']));
    }
  }
};

/**
 * Post handler.
 *
 * @param  {Request} req
 * @param  {Response} res
 */
export const liveSessionUsers = async (req: Request, res: Response) => {
  try {
    const liveSessionUsers_information = await userServices.liveSessionUsers();

    res
      .status(200)
      .json(apiUtils.buildSuccessResponse(liveSessionUsers_information));
  } catch (error) {
    if (error instanceof DataBaseError) {
      return res
        .status(422)
        .json(apiUtils.buildErrorResponse(['Server error']));
    } else if (error instanceof RequestError) {
      return res
        .status(error.code ?? 200)
        .json(apiUtils.buildErrorResponse(error));
    } else {
      return res
        .status(500)
        .json(apiUtils.buildErrorResponse(['Server error']));
    }
  }
};

/**
 * Post handler.
 *
 * @param  {Request} req
 * @param  {Response} res
 */
export const updateOnlineStatus = async (req: Request | any, res: Response) => {
  try {
    const { islive } = req.body;

    const payload = {
      user_id: req?.user?.user_id ?? '',
      islive,
    };
    const update_information = await userServices.updateOnlineStatus(payload);

    res.status(200).json(apiUtils.buildSuccessResponse(update_information));
  } catch (error) {
    if (error instanceof DataBaseError) {
      return res
        .status(422)
        .json(apiUtils.buildErrorResponse(['Server error']));
    } else if (error instanceof RequestError) {
      return res
        .status(error.code ?? 200)
        .json(apiUtils.buildErrorResponse(error));
    } else {
      return res
        .status(500)
        .json(apiUtils.buildErrorResponse(['Server error']));
    }
  }
};
