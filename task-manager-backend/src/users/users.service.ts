import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createPredefinedUser(): Promise<User> {
    const predefinedUser = {
      username: 'harsh',
      password: await bcrypt.hash('Harsh@14052002', 10),
      email: 'harsh@example.com',
    };

    const existingUser = await this.findOne({ where: { username: predefinedUser.username } });

    if (existingUser) {
      return existingUser;
    }

    return this.usersRepository.save(predefinedUser);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findOne({
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async findOne(conditions: any): Promise<User | null> {
    return this.usersRepository.findOne(conditions);
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
