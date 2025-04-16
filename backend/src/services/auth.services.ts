import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { config } from '../config';
import { AppError } from '../utils/appError';
import { v6 as uuidv6 } from 'uuid';

export class AuthService {
  async register(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) throw new AppError('User already exists', 400);

    if (password !== confirmPassword)
      throw new AppError('Passwords do not match', 400);

    const jti = uuidv6();
    const hashedPassword = await bcrypt.hash(password, 10);
    const accessToken = this.generateToken(email, jti, '24h');
    const refreshToken = this.generateToken(email, jti, '30d');

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        jwtId: jti,
        refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('User does not exist', 400);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AppError('Invalid credentials', 401);

    const jti = uuidv6();
    const accessToken = this.generateToken(email, jti, '24h');
    const refreshToken = this.generateToken(email, jti, '30d');

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { jwtId: jti, refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    };
  }

  async googleLogin(email: string, username: string, profileImg: string) {
    try {
      const jti = uuidv6();
      const accessToken = this.generateToken(email, jti, '24h');
      const refreshToken = this.generateToken(email, jti, '30d');

      //
      const hashedPassword =await bcrypt.hash('123456', 10);

      const user = await prisma.user.upsert({
        where: { email },
        update: { jwtId: jti, refreshToken },
        create: {
          username,
          email,
          jwtId: jti,
          refreshToken,
          profileImg,
          password: hashedPassword,
        },
      });

      if (!user) {
        throw new AppError('Failed to create or update user', 400);
      }

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      throw new AppError('Google login failed', 400); // This will be caught by express-async-errors
    }
  }

  private generateToken(email: string, jti: string, expiresIn: any) {
    const payload = { email, jti };
    const options: SignOptions = { expiresIn }; // Explicitly define options
    return jwt.sign(payload, config.jwtSecret as Secret, options);
  }
}
