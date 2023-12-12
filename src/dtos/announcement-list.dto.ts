import { vendors } from '@jmrl23/express-helper';

export class AnnouncementListDto {
  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsDateString()
  readonly created_at_from?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsDateString()
  readonly created_at_to?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsDateString()
  readonly updated_at_from?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsDateString()
  readonly updated_at_to?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString({ each: true })
  @vendors.classValidator.Length(1, undefined, { each: true })
  readonly keywords?: string[];

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsBoolean()
  readonly pin?: boolean;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsUUID()
  readonly user_id?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsInt()
  readonly skip?: number;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsInt()
  readonly take?: number;
}
