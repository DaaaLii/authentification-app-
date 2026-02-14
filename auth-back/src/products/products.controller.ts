import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import { Request } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AssignProductDto } from 'src/auth/dto/assign-product.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';


@Controller('products')
@UseGuards(JwtAuthGuard) // ✅ protège toutes les routes du controller
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll(
    @Req() req: Request & { user?: any },
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('minStock') minStock: number,
    @Query('maxStock') maxStock: number,
  ) {
    const user = req.user; // { id, email, name, role }

    return this.productsService.findAll({
      page,
      limit,
      search,
      minPrice,
      maxPrice,
      minStock,
      maxStock,

      // ✅ si user => filtre assignedTo
      userId: user?.id,
      role: user?.role,
    });
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':name')
  update(@Param('name') name: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(name, dto);
  } 

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard) // protège et vérifie le rôle
  @Roles('admin') //accessible seulement par les admin
@Patch(':id/assign')
assign(@Param('id') id: string, @Body() dto: AssignProductDto) {
  return this.productsService.assignProduct(id, dto.assignments);
}

}
