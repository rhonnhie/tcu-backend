import { vendors } from '@jmrl23/express-helper';

export class AnnouncementDeleteDto {
  @vendors.classValidator.IsUUID()
  readonly id: string;
}
