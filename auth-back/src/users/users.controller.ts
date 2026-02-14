import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // 🔐 toutes les routes protégées
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users?role=user
   * Utilisé par l'admin pour assigner des produits
   */
  @Get()
  async findAll(@Query('role') role?: 'admin' | 'user') {
    return this.usersService.findAll({
      role,
    });
  }
}
