import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // Replace with your PostgreSQL username
      password: 'your_password', // Replace with your PostgreSQL password
      database: 'task_manager',
      entities: [User, Task],
      synchronize: true, // Auto-create tables (use migrations in production)
    }),
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}