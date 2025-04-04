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
      synchronize: false, // Disabled for production
      ssl: true,
      extra: {
        max: 20,
        ssl: {
          rejectUnauthorized: false,
        },
        poolSize: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    }),
    AuthModule,
    TasksModule,
    HealthModule,
  ],
})
export class AppModule {}