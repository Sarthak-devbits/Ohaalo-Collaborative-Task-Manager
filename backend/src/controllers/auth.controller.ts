import { Request, Response } from 'express';
import { AuthService } from '../services/auth.services';
import { formResponse } from '../utils/formResponse';
import {
  loginValidationSchema,
  registerValidationSchema,
} from '../validation/auth.validation';
import { httpStatusCodes } from '../utils/httpStatusCode';


const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const validateData = registerValidationSchema.parse(req.body);
    const { username, email, password, confirmPassword } = validateData;

    const result = await authService.register(
      username,
      email,
      password,
      confirmPassword
    );

    return res.status(200).json(formResponse(200, result));
  }

  async login(req: Request, res: Response) {
    const validateData = loginValidationSchema.parse(req.body);
    const { email, password } = validateData;

    const result = await authService.login(email, password);

    return res.status(200).json(formResponse(200, result));
  }

  async googleLogin(req: Request, res: Response) {
    if (!req.user) {
      return res
        .status(httpStatusCodes[401].code)
        .json(
          formResponse(
            httpStatusCodes[401].code,
            'Google authentication failed'
          )
        );
    }

    const profile: any = req.user;
    const emailId = profile.emails?.[0]?.value || '';
    const username = profile.displayName || '';
    const profileImg = profile.photos?.[0]?.value || '';
    const result = await authService.googleLogin(emailId, username, profileImg);
    if (result) {
      return res.redirect(`http://localhost:5173/auth/google-redirect`);
    } else {
      return res.redirect(`http://localhost:5173/login`);
    }
  }
}
