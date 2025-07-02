import {Injectable, Logger, BadRequestException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserRepository} from './user.repository';
import {PasswordService} from './password.service';
import {SignupDto} from './dto/signupDto';
import {SigninDto} from './dto/signinDto';
import {AuthResponseDto, UserResponseDto, JwtPayload} from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {}

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const {email, password, username} = signupDto;

    const existingUser = await this.userRepository.existsByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    try {
      const user = await this.userRepository.create({
        email,
        password: hashedPassword,
        username
      });

      this.logger.log(`User registered successfully: ${email}`);

      const userResponse = this.mapToUserResponse(user);
      const accessToken = this.generateAccessToken(user);

      return {
        user: userResponse,
        accessToken
      };
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Registration failed: ${message}`, error);
      throw new BadRequestException('Registration failed');
    }
  }

  async signin(signinDto: SigninDto): Promise<AuthResponseDto> {
    const {email, password} = signinDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in successfully: ${email}`);

    const userResponse = this.mapToUserResponse(user);
    const accessToken = this.generateAccessToken(user);

    return {
      user: userResponse,
      accessToken
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserResponseDto | null> {
    const id = payload.sub;

    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return null;
      }

      return this.mapToUserResponse(user);
    } catch (error: any) {
      this.logger.error(`Token validation failed: ${error.message}`, error);
      return null;
    }
  }

  private generateAccessToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id.toString(),
      email: user.email
    };

    return this.jwtService.sign(payload);
  }

  private mapToUserResponse(user: any): UserResponseDto {
    return {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      isActive: user.is_active,
      createdAt: user.created_at
    };
  }
}
