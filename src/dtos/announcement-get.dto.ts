import { vendors } from '@jmrl23/express-helper';

export class AnnouncementGetDto {
  @vendors.classValidator.IsUUID()
  readonly id: string;
}
