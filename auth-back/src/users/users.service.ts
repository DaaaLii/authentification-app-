import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schema/users.schema';

@Injectable()
export class UsersService {
 
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
async findAll(filter: { role?: 'admin' | 'user' }) {
    const query: any = {};
    if (filter.role) query.role = filter.role;

    return this.userModel
      .find(query)
      .select('_id name email role avatar') // ✅ pas de passwordHash
      .sort({ name: 1 })
      .lean();
  }
  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findById(id: string) { // ✅ AJOUT
    return this.userModel.findById(id).exec();
  }

  async create(email: string, password: string, name: string, avatar?: string | null) {
    const passwordHash = await bcrypt.hash(password, 10);

    const created = new this.userModel({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      passwordHash,
      avatar: avatar ?? null, // ✅ AJOUT
    });

    return created.save();
  }

  async validatePassword(user: UserDocument, password: string) {
    return bcrypt.compare(password, user.passwordHash);
  }
}
