import { Injectable, UnauthorizedException, ConflictException,NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../users/schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async register(email: string, password: string, name: string, avatar?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    // ✅ on passe avatar au create
    const user = await this.usersService.create(email, password, name, avatar);

    // ✅ on renvoie aussi avatar
    return this.signToken(user._id.toString(), user.email, user.name);
  }

async updateAvatar(id: string, path: string) {
  const user = await this.userModel.findByIdAndUpdate(
    id,
    { avatar: path },
  );

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return {  path};
}
   
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await this.usersService.validatePassword(user, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // ✅ login renvoie avatar aussi
    return this.signToken(user._id.toString(), user.email, user.name);
  }

  private signToken(userId: string, email: string, name: string,avatar?: string) {
    const payload = { id: userId, email, name };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: userId, email, name, avatar: avatar ?? null }, // ✅ on renvoie avatar aussi
    };
  }
}
