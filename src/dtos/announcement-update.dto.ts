import { vendors } from '@jmrl23/express-helper';

export class AnnouncementUpdateDto {
  @vendors.classValidator.IsUUID('4')
  readonly id: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(1)
  readonly title?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(1)
  readonly content?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsBoolean()
  readonly pin?: boolean;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsUUID('4')
  readonly photo_id?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsArray()
  @vendors.classValidator.IsUUID('4', { each: true })
  readonly attachments?: string[];
}
