import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

import { JwtAuthGuard } from './../../shared/jwt/jwt-auth.guard';

@Controller('/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): object {
    return this.tasksService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() taskData: any): Promise<any> {
    return this.tasksService.create(taskData);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  get(@Param('id') id: number): Promise<any> {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new Error('ID debe ser un número válido');
    }
    return this.tasksService.findById(numericId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number): Promise<any> {
    const numericId = Number(id);

    if (isNaN(numericId)) {
      throw new Error('ID debe ser un número válido');
    }
    return this.tasksService.update(numericId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<void> {
    const numericId = Number(id);
    await this.tasksService.delete(numericId);
  }
}
