import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.model';

@Module({
  imports: [TypeOrmModule.forFeature([History])],
  controllers: [],
  providers: [],
})
export class HistoryModule {}
