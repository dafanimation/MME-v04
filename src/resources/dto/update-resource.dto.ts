import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
} from 'class-validator';

type ResourceLocationDto = {
  x: number;
  z: number;
  type?: string;
  tipo?: string;
  label?: string;
  mesaId?: number;
  num?: number;
  estId?: string;
  room?: string;
  placement?: string;
  anchor?: string;
  renderAnchorIndex?: number | null;
};

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  os?: string;

  @IsOptional()
  @IsString()
  cpu?: string;

  @IsOptional()
  @IsString()
  ghz?: string;

  @IsOptional()
  @IsInt()
  bits?: number;

  @IsOptional()
  @IsString()
  motherboard?: string;

  @IsOptional()
  @IsString()
  ram?: string;

  @IsOptional()
  @IsString()
  storage?: string;

  @IsOptional()
  @IsString()
  qrCode?: string;

  @IsOptional()
  @IsString()
  extras?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsIn(['available', 'shared', 'occupied', 'assigned', 'maintenance', 'review', 'recycle'])
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  driveLink?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number | null;

  @IsOptional()
  location?: ResourceLocationDto | null;
}
