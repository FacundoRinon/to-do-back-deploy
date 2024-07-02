import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(user: string, password: string): Promise<any> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: user }, { email: user }],
      },
    });

    if (!foundUser) {
      return 'Invalid credentials';
    }
    if (!(await bcrypt.compare(password, foundUser.password))) {
      return 'Invalid credentials';
    }

    const payload = {
      username: foundUser.username,
      sub: foundUser.user_id,
    };

    const token = this.jwtService.sign(payload);

    const userListsIds = await this.prisma.userList.findMany({
      where: {
        user_id: foundUser.user_id,
      },
    });

    const userTasksIds = await this.prisma.userTask.findMany({
      where: {
        user_id: foundUser.user_id,
      },
    });

    const listIds = userListsIds.map((userList: any) => userList.list_id);
    const taskIds = userTasksIds.map((userTask: any) => userTask.task_id);

    const lists = await this.prisma.list.findMany({
      where: {
        list_id: {
          in: listIds,
        },
      },
      orderBy: {
        creation_date: 'desc',
      },
    });

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

    const log = {
      token,
      id: foundUser.user_id,
      username: foundUser.username,
      email: foundUser.email,
      lists: lists,
      tasks: tasks,
      fastList: [],
    };

    return log;
  }

  async create(data: any) {
    const { username, email, password, confirmPass } = data;

    const unavailableUser = await this.prisma.user.findUnique({
      where: { username },
    });

    const unavailableEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    const passMatch = password === confirmPass;

    if (unavailableUser || unavailableEmail) {
      return 'Username or Email already exists';
    } else if (!passMatch) {
      return 'Passwords are not the same';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const newUser_id = newUser.user_id;

    const payload = {
      username: newUser.username,
      sub: newUser_id,
    };

    const token = this.jwtService.sign(payload);

    const userCreate = {
      token,
      id: newUser.user_id,
      username,
      email,
      lists: [],
      tasks: [],
      fastList: [],
    };

    return userCreate;
  }

  async update(id: number, data: any) {
    return this.prisma.user.update({
      where: { user_id: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { user_id: id },
    });
  }
}
