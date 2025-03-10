import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { GetAllProductsDTO } from "./dto/get-all-products.dto";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async getAllProducts(@Query() filters: GetAllProductsDTO) {
    return this.productsService.getAllProducts(filters);
  }

  @Get(":id")
  async getProductById(@Param("id") id: string) {
    return this.productsService.getProductById(Number(id));
  }

  @Get("top-ordered/:area")
  async getTopOrderedProducts(@Param("area") area: string) {
    return this.productsService.getTopOrderedProducts(area);
  }
}
