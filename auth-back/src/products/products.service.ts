import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/product.schema';

type FindAllQuery = {
  page: number;
  limit: number;
  search: string;
  minPrice: number;
  maxPrice: number;
  minStock: number;
  maxStock: number;
};
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

    async findAll(query: FindAllQuery) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 5));
    const skip = (page - 1) * limit;

    const filter: any = {};

    // recherche par nom (q)
    if (query.search && query.search.trim()) {
      filter.name = { $regex: query.search.trim(), $options: 'i' };
    }

    // filtre prix
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined && !Number.isNaN(query.minPrice)) {
        filter.price.$gte = query.minPrice;
      }
      if (query.maxPrice !== undefined && !Number.isNaN(query.maxPrice)) {
        filter.price.$lte = query.maxPrice;
      }
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    // filtre stock
    if (query.minStock !== undefined || query.maxStock !== undefined) {
      filter.stock = {};
      if (query.minStock !== undefined && !Number.isNaN(query.minStock)) {
        filter.stock.$gte = query.minStock;
      }
      if (query.maxStock !== undefined && !Number.isNaN(query.maxStock)) {
        filter.stock.$lte = query.maxStock;
      }
      if (Object.keys(filter.stock).length === 0) delete filter.stock;
    }

    const [items, total] = await Promise.all([
      this.productModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.productModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
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