import { createConnection } from 'typeorm';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';
import * as dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Task],
      synchronize: true, // This will create our tables
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    });

    console.log('✅ Database initialized successfully');
    
    // Create indexes
    await connection.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);
    
    console.log('✅ Indexes created successfully');
    
    await connection.close();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

initializeDatabase();
