import { NextFunction, Response, Request } from 'express';
import { buildErrorResponse, jwtVerifyToken } from '../utils/utils';

/**
 * AllowedHttpMethods middleware.
 *
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 */
export const allowedHttpMethods = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedMethods = ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json(buildErrorResponse(['Method Not Allowed']));
  }
  return next();
};

/**
 * AllowedHeader middleware.
 *
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 */
export const allowedHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
};

/**
 * AllowedContentType middleware.
 *
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 */
export const allowedContentType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (req.method === 'POST' || req.method === 'PUT') {
  //   return res
  //     .status(415)
  //     .json(buildErrorResponse(['Unsupported Content-Type']));
  // }
  return next();
};

/**
 * authorization middleware.
 *
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 */

export const authorization = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers['authorization'] !== '') {
      const token = req.headers['authorization'].split(' ')[1] ?? '';

      const payload = (await jwtVerifyToken(token ? token : '')) as {
        user_id: string;
      };
      req.user = {
        user_id: payload.user_id,
      };
      return next();
    }
    return res.status(403).json(
      buildErrorResponse({
        status: 403,
        message: 'Unauthorized',
      })
    );
  } catch (error) {
    return res.status(403).json(
      buildErrorResponse({
        status: 403,
        message: 'Unauthorized',
      })
    );
  }
};

