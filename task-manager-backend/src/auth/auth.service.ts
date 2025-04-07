import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async ensureDefaultUser() {
    const username = 'harsh';
    const password = 'Harsh@14052002';

    await this.usersService.createPredefinedUser();
    console.log('Default user created/checked');
  }

  async login(user: { username: string; password: string }) {
    const userEntity = await this.usersService.validateUser(user.username, user.password);
    if (!userEntity) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: userEntity.username, sub: userEntity.id };
    const token = jwt.sign(payload, this.configService.get('JWT_SECRET') || 'your-secret-key', {
      expiresIn: '24h',
    });
    return { access_token: token };
  }

  async validateUser(username: string, password: string) {
    return this.usersService.validateUser(username, password);
  }

  async register(username: string, password: string) {
    const hashedPassword = await this.usersService.hashPassword(password);
    const user = await this.usersService.create({ username, password: hashedPassword });
    return { message: 'User registered successfully' };
  }
}