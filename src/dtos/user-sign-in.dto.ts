import { vendors } from '@jmrl23/express-helper';

export class UserSignInDto {
  @vendors.classValidator.IsString()
  readonly username: string;

  @vendors.classValidator.IsString()
  readonly password: string;
}
