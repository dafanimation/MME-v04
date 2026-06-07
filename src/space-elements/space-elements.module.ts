import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceElement } from './space-element.model';
import { SpaceElementsService } from './space-elements.service';
import { SpaceElementsController } from './space-elements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceElement])],
  providers: [SpaceElementsService],
  controllers: [SpaceElementsController],
  exports: [SpaceElementsService],
})
export class SpaceElementsModule {}
