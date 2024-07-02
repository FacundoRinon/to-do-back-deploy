import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }

  async create(data: any) {
    const { title, description, date, user_id, list_id } = data;
    let newTask;

    try {
      newTask = await this.prisma.task.create({
        data: {
          title,
          description,
          dateToComplete: date,
        },
      });
    } catch (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }

    try {
      await this.prisma.userTask.create({
        data: {
          user_id,
          task_id: newTask.task_id,
        },
      });
    } catch (error) {
      await this.prisma.task.delete({
        where: {
          task_id: newTask.task_id,
        },
      });
      throw new Error(`Error creating UserTask entry: ${error.message}`);
    }

    try {
      await this.prisma.listTask.create({
        data: {
          list_id,
          task_id: newTask.task_id,
        },
      });
    } catch (error) {
      await this.prisma.task.delete({
        where: {
          task_id: newTask.task_id,
        },
      });
      throw new Error(`Error creating ListTask entry: ${error.message}`);
    }

    return newTask;
  }

  async findById(id: number) {
    const userTasksIds = await this.prisma.userTask.findMany({
      where: {
        user_id: id,
      },
    });
    const taskIds = userTasksIds.map((task: any) => task.task_id);
    const userTasks = await this.prisma.task.findMany({
      where: {
        task_id: {
          in: taskIds,
        },
      },
      orderBy: {
        creation_date: 'desc',
      },
    });
    return userTasks;
  }

  async update(id: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        task_id: id,
      },
    });

    let newState: 'pending' | 'completed';
    if (task.state === 'pending') {
      newState = 'completed';
    } else if (task.state === 'completed') {
      newState = 'pending';
    }

    const updatedTask = await this.prisma.task.update({
      where: {
        task_id: id,
      },
      data: {
        state: newState,
      },
    });

    return updatedTask;
  }

  async delete(id: number) {
    await this.prisma.userTask.deleteMany({
      where: {
        task_id: id,
      },
    });

    await this.prisma.listTask.deleteMany({
      where: {
        task_id: id,
      },
    });

    await this.prisma.task.delete({
      where: {
        task_id: id,
      },
    });
  }
}
