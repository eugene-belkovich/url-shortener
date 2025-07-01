import {Transform} from 'class-transformer';
import {IsString, Length, Matches} from 'class-validator';

export class UpdateSlugDto {
  @IsString({message: 'Slug must be a string'})
  @Length(1, 7, {message: 'Slug must be between 1 and 7 characters'})
  @Matches(/^[a-zA-Z0-9]+$/, {message: 'Slug can only contain letters and numbers'})
  @Transform(({value}) => value?.trim())
  newSlug: string;
}
