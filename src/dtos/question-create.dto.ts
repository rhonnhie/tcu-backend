import { vendors } from '@jmrl23/express-helper';

export class QuestionCreateDto {
  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(1)
  readonly question: string;

  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(1)
  readonly answer: string;
}
