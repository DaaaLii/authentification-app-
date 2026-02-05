import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private usersService: UsersService,
     private jwtService: JwtService, // ✅ ajout
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.name ?? '', dto.avatar);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException(); // ✅ IMPORTANT

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar ?? null, // ✅ ne doit plus être rouge si schema OK
    };
  }
}
