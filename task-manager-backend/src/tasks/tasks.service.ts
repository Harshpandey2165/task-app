import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(user: User): Promise<Task[]> {
    return this.tasksRepository.find({ where: { user: { id: user.id } } });
  }

  async create(task: Partial<Task>, user: User): Promise<Task> {
    const newTask = this.tasksRepository.create({ ...task, user });
    return this.tasksRepository.save(newTask);
  }

  async update(id: number, task: Partial<Task>, user: User): Promise<Task> {
    await this.tasksRepository.update({ id, user: { id: user.id } }, task);
    const updatedTask = await this.tasksRepository.findOne({ where: { id } });
    if (!updatedTask) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  async delete(id: number, user: User): Promise<void> {
    await this.tasksRepository.delete({ id, user: { id: user.id } });
  }
}