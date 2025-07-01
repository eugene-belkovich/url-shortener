import {Controller, Post, Get, Body, UseGuards, Logger, Res, HttpStatus} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignupDto} from './dto/signupDto';
import {SigninDto} from './dto/signinDto';
import {AuthResponseDto, UserResponseDto} from './dto/auth-response.dto';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {CurrentUser} from './decorators/current-user.decorator';
import {FastifyReply} from 'fastify';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    this.logger.log(`Signup attempt for email: ${signupDto.email}`);
    return await this.authService.signup(signupDto);
  }

  @Post('signin')
  async signin(@Body() signinDto: SigninDto): Promise<AuthResponseDto> {
    this.logger.log(`Signin attempt for email: ${signinDto.email}`);
    return await this.authService.signin(signinDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: UserResponseDto): Promise<UserResponseDto> {
    this.logger.log(`Profile request for user: ${user.email}`);
    return user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: UserResponseDto, @Res() res: FastifyReply) {
    this.logger.log(`User logged out: ${user.id}`);
    return res.status(HttpStatus.OK).send({message: 'Logged out'});
  }
}
