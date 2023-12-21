import { vendors } from '@jmrl23/express-helper';

export class QuestionListDto {
  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsDateString()
  readonly created_at_from?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsDateString()
  readonly created_at_to?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsDateString()
  readonly updated_at_from?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsDateString()
  readonly updated_at_to?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString({ each: true })
  @vendors.classValidator.Length(1, undefined, { each: true })
  readonly question?: string[];

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString({ each: true })
  @vendors.classValidator.Length(1, undefined, { each: true })
  readonly answer?: string[];

  
}
