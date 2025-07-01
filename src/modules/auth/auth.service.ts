import {Injectable, Logger, BadRequestException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserRepository} from './user.repository';
import {PasswordService} from './password.service';
import {SignupDto} from './dto/signupDto';
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
      this.logger.error(`Registration failed: ${error.message}`, error);
      throw new BadRequestException('Registration failed');
    }
  }

  async validateUser(payload: JwtPayload): Promise<UserResponseDto | null> {
    try {
      const user = await this.userRepository.findById(payload.sub);
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
