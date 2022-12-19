import { Express } from 'express';
import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';

import userController from './user.controller';
import { createUserValidation, getUserValidation, loginValidation } from './user.schemas';

const userRouter = (app: Express) => {

  app.get('/me', requireAuth, userController.getProfile);
  app.get('/users', requireAuth, userController.getUsers);
  app.get('/users/:id', requireAuth, validateRequest(getUserValidation), userController.getUser);

  // Auth
  app.post('/users', validateRequest(createUserValidation), userController.signUp);
  app.post('/users/login', validateRequest(loginValidation), userController.login);

};

export default userRouter;