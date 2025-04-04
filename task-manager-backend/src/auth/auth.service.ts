import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { this.ensureDefaultUser();}

  async ensureDefaultUser() {
    const username = 'harsh';
    const password = 'Harsh@123456789';

    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.usersRepository.create({ username, password: hashedPassword });
        await this.usersRepository.save(newUser);
        console.log('Default user created: harsh');
    } else {
        console.log('Default user already exists');
    }
}


  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashedPassword });
    await this.usersRepository.save(user);
    return { message: 'User registered successfully' };
  }
}