import { vendors } from '@jmrl23/express-helper';
import { UserRole } from '@prisma/client';

export class UserCreateDto {
  @vendors.classValidator.IsString()
  @vendors.classValidator.Matches('^[a-zA-Z0-9_]{4,}[0-9]*$', void 0, {
    message: 'Invalid username',
  })
  readonly username: string;

  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(8)
  readonly password: string;

  @vendors.classValidator.IsEnum(UserRole)
  readonly role: UserRole;
}
