import {Expose, Transform} from 'class-transformer';

export class UrlResponseDto {
  id: string;

  @Expose()
  slug: string;

  @Expose()
  originalUrl: string;

  @Expose()
  shortUrl: string;

  @Expose()
  @Transform(({value}) => value?.toISOString())
  createdAt: Date;

  @Expose()
  @Transform(({value}) => value?.toISOString())
  updatedAt: Date;

  @Expose()
  visits?: number;

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
