import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  findAll() {
    return this.productModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(name: string, dto: UpdateProductDto) {
    const updated = await this.productModel.findOneAndUpdate({ name: name }, dto, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.productModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Product not found');
    return { deleted: true };
  }
}
