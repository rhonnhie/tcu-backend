import { vendors } from '@jmrl23/express-helper';
import { UserRole } from '@prisma/client';

export class UserUpdateDto {
  @vendors.classValidator.IsUUID('4')
  readonly id: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(8)
  readonly password?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsEnum(UserRole)
  readonly role?: UserRole;
}
