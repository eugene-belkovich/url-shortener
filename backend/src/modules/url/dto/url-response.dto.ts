import {Expose, Transform} from 'class-transformer';
import {IsOptional} from 'class-validator';

export class UrlResponseDto {
  @IsOptional()
  id?: string;

  @Expose()
  slug: string;

  @Expose()
  originalUrl: string;

  @Expose()
  shortUrl: string;

  @IsOptional()
  userId?: string | null;

  @Expose()
  @Transform(({value}) => value?.toISOString())
  createdAt: Date;

  @Expose()
  @Transform(({value}) => value?.toISOString())
  updatedAt: Date;

  @Expose()
  clicks?: number;

  @Expose()
  @Transform(({value}) => value?.toISOString())
  lastVisited?: Date;
}

export class UrlListResponseDto {
  @Expose()
  urls: UrlResponseDto[];

  @Expose()
  total: number;
}
