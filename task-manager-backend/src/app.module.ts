import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Task],
      synchronize: true, // Be careful with this in production
      ssl: process.env.NODE_ENV === 'production',
      extra: {
        max: 20,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
      },
    }),
    AuthModule,
    TasksModule,
    HealthModule,
  ],
})
export class AppModule {}