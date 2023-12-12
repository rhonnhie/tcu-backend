import { vendors } from '@jmrl23/express-helper';

export class FileGetDto {
  @vendors.classValidator.IsUUID('4')
  readonly id: string;

  @vendors.classValidator.Length(1)
  readonly name: string;
}
