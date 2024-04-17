/**
 * @file user routes
 */
import { Router } from 'express';
import { validateSchema, whitelist } from '../utils/utils';
import {
  createUser,
  loginUser,
  getDashboardInformation,
  getPlatformUsers,
  liveSessionUsers,
  updateOnlineStatus,
} from '../controllers/user.controller';
import { LoginSchema, RegistrationSchema } from '../schemas/user.schema';
import { authorization } from '../middlewares/app.middleware';

const router = Router();

router
  .route('/register')
  .post(
    [validateSchema(RegistrationSchema)], 
    createUser
    );

router
  .route('/login')
  .post(
    [validateSchema(LoginSchema), loginUser]
    );

router
  .route('/user-dashboard-information')
  .get(
    [authorization], 
    getDashboardInformation
    );

router
  .route('/platform-users')
  .get(
    [authorization], 
    getPlatformUsers
    );

router
  .route('/live-session-users')
  .get([authorization], 
    liveSessionUsers
    );
router
  .route('/online-status')
  .post([authorization], 
    updateOnlineStatus
    );

export default router;
