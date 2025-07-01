import {Transform} from 'class-transformer';
import {IsOptional, IsString, IsUrl, Length, Matches} from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsUrl({require_protocol: true, require_tld: false})
  // todo constraint? @Length(1, 2048, {message: 'URL must be between 1 and 2048 characters'})
  @Transform(({value}) => value?.trim())
  originalUrl: string;

  @IsOptional()
  @IsString()
  @Length(1, 7, {message: 'Custom slug must be between 1 and 7 characters'})
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Custom slug can only contain letters and numbers'
  })
  @Transform(({value}) => value?.trim())
  customSlug?: string;
}
