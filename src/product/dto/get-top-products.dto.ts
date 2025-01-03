import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TopProductsDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  @IsString()
  area: string;

  @IsNumber()
  @IsNotEmpty()
  total_quantity: number;
}
