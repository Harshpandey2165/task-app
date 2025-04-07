import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Task } from './task.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async findAll(@Request() req): Promise<Task[]> {
    return this.tasksService.findAll(req.user);
  }

  @Post()
  async create(@Body() task: Partial<Task>, @Request() req): Promise<Task> {
    return this.tasksService.create(task, req.user);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() task: Partial<Task>, @Request() req): Promise<Task> {
    try {
      return await this.tasksService.update(id, task, req.user);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req): Promise<void> {
    return this.tasksService.delete(id, req.user);
  }
}