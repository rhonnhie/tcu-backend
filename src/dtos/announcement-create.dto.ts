import { vendors } from '@jmrl23/express-helper';

export class AnnouncementCreateDto {
  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(1)
  readonly title: string;

  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(1)
  readonly content: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsUUID('4')
  readonly photo_id?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsArray()
  @vendors.classValidator.IsUUID('4', { each: true })
  readonly attachments?: string[];
}
