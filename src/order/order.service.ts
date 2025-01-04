import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateOrderDTO } from "./dto/create-order-dto";

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async create(orderData: CreateOrderDTO) {
    const { customerId, items } = orderData;

    // Create the order and related order items
    const order = await this.prismaService.order.create({
      data: {
        customerId,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }
}
