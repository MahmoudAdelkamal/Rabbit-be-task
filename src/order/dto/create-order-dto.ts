import { IsInt, IsNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class OrderItemDTO {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDTO {
  @IsInt()
  @IsNotEmpty()
  customerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];
}
