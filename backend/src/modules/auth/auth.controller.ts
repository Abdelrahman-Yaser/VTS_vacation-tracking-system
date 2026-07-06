import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateSignInDto } from './dto/signIn.dto';
import { CreateSignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() dto: CreateSignInDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @Post('sign-up')
  signUp(@Body() dto: CreateSignUpDto) {
    return this.authService.signUp(dto);
  }
}
