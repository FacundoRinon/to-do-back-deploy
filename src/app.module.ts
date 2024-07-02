import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { JwtAppModule } from './shared/jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { ListsModule } from './modules/lists/lists.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    PrismaModule,
    JwtAppModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    ListsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
