import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { PrismaModule } from 'src/prisma/prisma.module';

import { JwtAppModule } from './../../shared/jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtAppModule],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
