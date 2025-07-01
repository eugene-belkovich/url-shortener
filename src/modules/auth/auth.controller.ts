import {Controller, Post, Get, Body, UseGuards, Logger} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignupDto} from './dto/signupDto';
import {AuthResponseDto, UserResponseDto} from './dto/auth-response.dto';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {CurrentUser} from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    this.logger.log(`Signup attempt for email: ${signupDto.email}`);
    return await this.authService.signup(signupDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: UserResponseDto): Promise<UserResponseDto> {
    this.logger.log(`Profile request for user: ${user.email}`);
    return user;
  }
}
