import { createConnection } from 'typeorm';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';

async function testConnection() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Task],
      synchronize: false,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    });

    console.log('Successfully connected to the database');
    await connection.close();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

testConnection();
