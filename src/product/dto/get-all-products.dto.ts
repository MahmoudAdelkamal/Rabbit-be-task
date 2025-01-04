import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ArrayMinSize,
} from "class-validator";

export class GetAllProductsDTO {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  categories?: string[];

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
