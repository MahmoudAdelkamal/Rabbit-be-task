import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { TopProductsDto } from "./dto/get-top-products.dto";
describe("ProductsController", () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductsService = {
    getTopOrderedProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  describe("getTopOrderedProducts", () => {
    const mockArea = "Nasr city";
    const mockProducts: TopProductsDto[] = [
      {
        id: 1,
        name: "Product 1",
        category: "Category 1",
        area: "Nasr city",
        total_quantity: 100,
      },
      {
        id: 2,
        name: "Product 2",
        category: "Category 1",
        area: "Nasr city",
        total_quantity: 80,
      },
    ];

    it("should call service method with correct parameter", async () => {
      mockProductsService.getTopOrderedProducts.mockResolvedValue(mockProducts);

      await controller.getTopOrderedProducts(mockArea);

      expect(service.getTopOrderedProducts).toHaveBeenCalledWith(mockArea);
    });

    it("should return products array", async () => {
      mockProductsService.getTopOrderedProducts.mockResolvedValue(mockProducts);

      const result = await controller.getTopOrderedProducts(mockArea);

      expect(result).toEqual(mockProducts);
    });
  });
});
