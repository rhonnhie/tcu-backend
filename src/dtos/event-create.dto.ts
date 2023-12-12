import { vendors } from '@jmrl23/express-helper';

export class EventCreateDto {
  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(1)
  readonly title: string;

  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(1)
  readonly content: string;

  @vendors.classValidator.IsDateString()
  readonly date_of_event: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsUUID('4')
  readonly photo_id?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsArray()
  @vendors.classValidator.IsUUID('4', { each: true })
  readonly attachments?: string[];
}
