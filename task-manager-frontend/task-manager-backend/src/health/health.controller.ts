import { Controller, Get, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  @Get()
  async check() {
    try {
      this.logger.log('Checking database connection...');
      await this.connection.query('SELECT 1');
      const response = {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
      };
      this.logger.log('Health check successful', response);
      return response;
    } catch (error) {
      this.logger.error('Health check failed', error.stack);
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
      };
    }
  }
}
