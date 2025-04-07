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
      synchronize: true, // Enable for initial setup
      ssl: process.env.NODE_ENV === 'production',
      extra: {
        ssl: process.env.NODE_ENV === 'production' 
          ? { rejectUnauthorized: false }
          : false,
      },
    }),
    AuthModule,
    TasksModule,
    HealthModule,
  ],
})
export class AppModule {}