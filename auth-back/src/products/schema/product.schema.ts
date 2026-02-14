import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { User } from 'src/users/schema/users.schema'; // ajuste le chemin si besoin

export type ProductDocument = HydratedDocument<Product>;
//schema du produit par id et stock
@Schema({ _id: false })
export class ProductAssignment {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0 })
  stock: number;
}
const ProductAssignmentSchema = SchemaFactory.createForClass(ProductAssignment);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  // ✅ nouveau : produit assigné à un user (optionnel)
   @Prop({ type: [ProductAssignmentSchema], default: [] })
  assignments: ProductAssignment[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
