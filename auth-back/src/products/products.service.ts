import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  userId?: string;
  role?: 'admin' | 'user';
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  /**
   * ✅ Mode "dispatch" :
   * - assignments.stock = quantité donnée à chaque user (on ADD)
   * - product.stock = stock restant disponible (on SUB)
   */
  async assignProduct(productId: string, assignments: Array<{ userId: string; stock: number }>) {
  const product = await this.productModel.findById(productId);
  if (!product) throw new NotFoundException('Product not found');

  const clean = (assignments || [])
    .filter(a => a?.userId && Types.ObjectId.isValid(a.userId))
    .map(a => ({ userId: new Types.ObjectId(a.userId), stock: Math.max(0, Number(a.stock) || 0) }))
    .filter(a => a.stock > 0);

  if (clean.length === 0) throw new BadRequestException('Aucune assignation valide');

  const totalToAssign = clean.reduce((acc, a) => acc + a.stock, 0);
  if (totalToAssign > product.stock) {
    throw new BadRequestException(`Stock insuffisant: demandé ${totalToAssign}, disponible ${product.stock}`);
  }

  const map = new Map<string, any>();
  for (const a of product.assignments ?? []) map.set(String(a.userId), a);

  for (const add of clean) {
    const key = String(add.userId);
    if (map.has(key)) map.get(key).stock += add.stock;
    else map.set(key, { userId: add.userId, stock: add.stock });
  }

  product.assignments = Array.from(map.values());
  product.stock -= totalToAssign;

  await product.save();

  return this.productModel.findById(productId).populate('assignments.userId', 'name email role');
}


  async findAll(query: FindAllQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: any = {};

    // ✅ user ne voit que les produits où il est assigné
    if (query.role === 'user') {
      if (!query.userId) return { items: [], total: 0, page, limit };
      filter['assignments.userId'] = query.userId;
    }

    // recherche
    if (query.search && query.search.trim()) {
      filter.name = { $regex: query.search.trim(), $options: 'i' };
    }

    // prix
    const minPrice =
      query.minPrice !== undefined ? Number(query.minPrice) : undefined;
    const maxPrice =
      query.maxPrice !== undefined ? Number(query.maxPrice) : undefined;

    if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
      filter.price = {};
      if (minPrice !== undefined && !Number.isNaN(minPrice))
        filter.price.$gte = minPrice;
      if (maxPrice !== undefined && !Number.isNaN(maxPrice))
        filter.price.$lte = maxPrice;
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    // stock
    const minStock =
      query.minStock !== undefined ? Number(query.minStock) : undefined;
    const maxStock =
      query.maxStock !== undefined ? Number(query.maxStock) : undefined;

    if (!Number.isNaN(minStock) || !Number.isNaN(maxStock)) {
      filter.stock = {};
      if (minStock !== undefined && !Number.isNaN(minStock))
        filter.stock.$gte = minStock;
      if (maxStock !== undefined && !Number.isNaN(maxStock))
        filter.stock.$lte = maxStock;
      if (Object.keys(filter.stock).length === 0) delete filter.stock;
    }

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('assignments.userId', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.productModel.countDocuments(filter),
    ]);

    // ✅ ajouter des champs calculés (utile front)
    const itemsWithCalc = items.map((p: any) => {
      const assignedSum = (p.assignments ?? []).reduce(
        (acc: number, a: any) => acc + (a.stock || 0),
        0,
      );
      const obj = p.toObject ? p.toObject() : p;
      return {
        ...obj,
        assignedSum,
        // ⚠️ ici product.stock est déjà le "disponible restant"
        // remainingStock = stock disponible (déjà)
        remainingStock: obj.stock,
      };
    });

    return { items: itemsWithCalc, total, page, limit };
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('assignments.userId', 'name email role');
    if (!product) throw new NotFoundException('Product not found');

    // ✅ calc (optionnel)
    const assignedSum = (product.assignments ?? []).reduce(
      (acc: number, a: any) => acc + (a.stock || 0),
      0,
    );

    const obj = (product as any).toObject ? (product as any).toObject() : product;
    return { ...obj, assignedSum, remainingStock: obj.stock };
  }

  async update(name: string, dto: UpdateProductDto) {
  const product = await this.productModel.findOne({ name });
  if (!product) throw new NotFoundException('Product not found');

  if (dto.stock !== undefined) {
    const newStock = Math.max(0, Number(dto.stock) || 0);
    product.stock = newStock;
  }

  if (dto.price !== undefined) product.price = Number(dto.price);
  if (dto.name !== undefined) product.name = dto.name;

  await product.save();
  return product;
}


  async remove(id: string) {
    const deleted = await this.productModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Product not found');
    return { deleted: true };
  }
}
