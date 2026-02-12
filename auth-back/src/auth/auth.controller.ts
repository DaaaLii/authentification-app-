import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException ,
  UploadedFile,
  UseInterceptors} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  @UseGuards(JwtAuthGuard)
    @Post('avatar')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/avatars',
          filename: (_, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, unique + extname(file.originalname));
          },
        }),
      }),
    )
    uploadAvatar(@Req() req: any,@UploadedFile() file: Express.Multer.File) {
      return this.auth.updateAvatar(req.user.id, `uploads/avatars/${file.filename}`);
      
    }
}
