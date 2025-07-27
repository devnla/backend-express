import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserModel, IUser } from '../entities/User';
import { getPostgresConnection, getDatabaseDriver } from '../config/database';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateToken(payload: { id: string; email: string }): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw createError('JWT secret not configured', 500);
    }
    return jwt.sign(payload, jwtSecret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions);
  }

  async register(userData: CreateUserData) {
    const driver = getDatabaseDriver();
    const hashedPassword = await this.hashPassword(userData.password);

    try {
      if (driver === 'mongodb') {
        const existingUser = await UserModel.findOne({ email: userData.email });
        if (existingUser) {
          throw createError('User already exists', 409);
        }

        const user = new UserModel({
          ...userData,
          password: hashedPassword
        });
        await user.save();

        const token = this.generateToken({ id: (user._id as any).toString(), email: user.email });
        return { token, user: { ...user.toObject(), password: undefined } };
      } else {
        const postgresConnection = getPostgresConnection();
        if (!postgresConnection) {
          throw createError('Database connection not available', 500);
        }

        const userRepository = postgresConnection.getRepository(User);
        const existingUser = await userRepository.findOne({ where: { email: userData.email } });
        if (existingUser) {
          throw createError('User already exists', 409);
        }

        const user = userRepository.create({
          ...userData,
          password: hashedPassword
        });
        await userRepository.save(user);

        const token = this.generateToken({ id: user.id, email: user.email });
        return { token, user: { ...user, password: undefined } };
      }
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(loginData: LoginData) {
    const driver = getDatabaseDriver();

    try {
      if (driver === 'mongodb') {
        const user = await UserModel.findOne({ email: loginData.email });
        if (!user || !await this.comparePassword(loginData.password, user.password)) {
          throw createError('Invalid credentials', 401);
        }

        const token = this.generateToken({ id: (user._id as any).toString(), email: user.email });
        return { token, user: { ...user.toObject(), password: undefined } };
      } else {
        const postgresConnection = getPostgresConnection();
        if (!postgresConnection) {
          throw createError('Database connection not available', 500);
        }

        const userRepository = postgresConnection.getRepository(User);
        const user = await userRepository.findOne({ where: { email: loginData.email } });
        if (!user || !await this.comparePassword(loginData.password, user.password)) {
          throw createError('Invalid credentials', 401);
        }

        const token = this.generateToken({ id: user.id, email: user.email });
        return { token, user: { ...user, password: undefined } };
      }
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async getUserById(id: string) {
    const driver = getDatabaseDriver();

    try {
      if (driver === 'mongodb') {
        const user = await UserModel.findById(id).select('-password');
        if (!user) {
          throw createError('User not found', 404);
        }
        return user;
      } else {
        const postgresConnection = getPostgresConnection();
        if (!postgresConnection) {
          throw createError('Database connection not available', 500);
        }

        const userRepository = postgresConnection.getRepository(User);
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
          throw createError('User not found', 404);
        }
        return { ...user, password: undefined };
      }
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();