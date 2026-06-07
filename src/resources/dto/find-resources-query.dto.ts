// src/resources/dto/find-resources-query.dto.ts
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class FindResourcesQueryDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsIn(['available', 'shared', 'occupied', 'assigned', 'maintenance', 'review', 'recycle'])
  status?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
