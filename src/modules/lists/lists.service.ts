import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.list.findMany();
  }

  async create(data: any) {
    const { title, type, deadline, user_id } = data;
    let newList;

    try {
      newList = await this.prisma.list.create({
        data: {
          title,
          type,
          deadline,
        },
      });
    } catch (error) {
      throw new Error(`Error creating list: ${error.message}`);
    }

    try {
      await this.prisma.userList.create({
        data: {
          user_id,
          list_id: newList.list_id,
        },
      });
    } catch (error) {
      await this.prisma.list.delete({
        where: {
          list_id: newList.list_id,
        },
      });
      throw new Error(`Error creating UserList entry: ${error.message}`);
    }

    return newList;
  }

  async findListById(listId: number, userId: number) {
    const list = await this.prisma.list.findUnique({
      where: {
        list_id: listId,
      },
    });

    const tasksInList = await this.prisma.listTask.findMany({
      where: {
        list_id: listId,
      },
    });

    const taskIds = tasksInList.map((listTask: any) => listTask.task_id);

    const tasks = await this.prisma.task.findMany({
      where: {
        task_id: {
          in: taskIds,
        },
      },
      orderBy: {
        creation_date: 'desc',
      },
    });

    const listWithTasks = {
      ...list,
      tasks: tasks,
    };

    const author = await this.prisma.userList.findFirst({
      where: {
        list_id: listId,
        user_id: userId,
      },
    });
    if (author.user_id === userId) {
      return listWithTasks;
    } else {
      return 'invalid';
    }
  }

  async deleteListById(id: number) {
    const tasksInList = await this.prisma.listTask.findMany({
      where: {
        list_id: id,
      },
    });
    const idsInList = tasksInList.map((listTask: any) => listTask.task_id);

    await this.prisma.listTask.deleteMany({
      where: {
        list_id: id,
      },
    });

    await this.prisma.userTask.deleteMany({
      where: {
        task_id: {
          in: idsInList,
        },
      },
    });

    await this.prisma.task.deleteMany({
      where: {
        task_id: {
          in: idsInList,
        },
      },
    });

    await this.prisma.userList.deleteMany({
      where: {
        list_id: id,
      },
    });

    await this.prisma.list.delete({
      where: {
        list_id: id,
      },
    });
  }
}
