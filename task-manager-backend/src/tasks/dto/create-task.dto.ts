import { IsString, IsEnum } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['To Do', 'In Progress', 'Done'])
  status: 'To Do' | 'In Progress' | 'Done';
}