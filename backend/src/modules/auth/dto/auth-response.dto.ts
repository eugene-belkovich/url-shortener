export interface UserResponseDto {
  id: string;
  email: string;
  username?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
