import { vendors } from '@jmrl23/express-helper';

export class QuestionUpdateDto {
  @vendors.classValidator.IsUUID('4')
  readonly id: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(1)
  readonly question?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(1)
  readonly answer?: string;
}
