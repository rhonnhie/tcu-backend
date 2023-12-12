import { vendors } from '@jmrl23/express-helper';

export class EventGetDto {
  @vendors.classValidator.IsUUID()
  readonly id: string;
}
