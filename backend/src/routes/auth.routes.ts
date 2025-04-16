// Purpose: Routing for authentication requests.
import { AuthController } from '../controllers/auth.controller';
import passport from '../config/passport';
import { Router } from 'express';


export const authRoutes = Router();

const controller = new AuthController();

authRoutes.post('/signup', controller.register);
authRoutes.post('/login', controller.login);

// Google Authentication
authRoutes.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);
authRoutes.get(
  '/googleRedirect',
  passport.authenticate('google', { session: false }),
  controller.googleLogin
);
