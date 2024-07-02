import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from 'src/prisma/prisma.module';

import { JwtAppModule } from './../../shared/jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtAppModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
