import { vendors } from '@jmrl23/express-helper';

export class EventDeleteDto {
  @vendors.classValidator.IsUUID()
  readonly id: string;
}
