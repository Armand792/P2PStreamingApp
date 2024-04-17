import { NextFunction, Request, Response } from 'express';
import Ajv, { DefinedError, AnySchema } from 'ajv';
import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';
import { ExpressWinstonRequest } from 'express-winston';
import jwt, { JwtPayload } from 'jsonwebtoken';

// const Ajv = ajvModule.default;
const ajv = new Ajv({
  allErrors: true,
});

/**
 * Builds a success response.
 *
 * @param  {any} data
 */
export const buildSuccessResponse = (data: object | [] | null | void) => {
  return {
    status: 'SUCCESS',
    result: data,
  };
};

/**
 * Builds an error response.
 *
 * @param  {string[]} errors
 */
export const buildErrorResponse = (errors: string[] | object) => {
  return {
    status: 'ERROR',
    errors,
  };
};

/**
 * Validate schema middleware.
 *
 * @param  {AnySchema} schema
 */
export const validateSchema = (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validate = ajv.compile(schema);

    if (!validate(req.body)) {
      const errors: string[] = []; 
      for (const err of validate.errors as DefinedError[]) {
        if (err.message) {
          errors.push(err.message);
        }
      }
      return res.status(422).json(buildErrorResponse(errors));
    }
    return next();
  };
};

/**
 * WhitelistOptions interface
 *
 */
export interface WhitelistOptions {
  body?: string[];
  req?: string[];
  res?: string[];
}

/**
 * Validate schema middleware.
 *
 * @param  {AnySchema} schema
 */
export const whitelist = (options: WhitelistOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ewReq = req as ExpressWinstonRequest;
    if (options.body) {
      ewReq._routeWhitelists.body = options.body;
    }
    if (options.req) {
      ewReq._routeWhitelists.req = options.req;
    }
    if (options.res) {
      ewReq._routeWhitelists.res = options.res;
    }
    return next();
  };
};

/**
 * @param raw password
 * @return hashed password
 *
 */

export const hashPassword = async (
  password: string,
  salt = 10
): Promise<string> => {
  return await bcrypt.hash(password, salt);
};

/**
 * @param plain password & hashed password
 * @return  boolean
 *
 */

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * @param options
 * @return string
 *
 */

export const jwtToken = async (payload: {
  [key: string]: any;
}): Promise<string> => {
  return await jwt.sign(payload, process.env!.JWTKEY ?? '');
};

export const jwtVerifyToken = async (
  token: string
): Promise<string | JwtPayload> => {
  return await jwt.verify(token, process.env!.JWTKEY ?? '');
};