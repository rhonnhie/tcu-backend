import { vendors } from '@jmrl23/express-helper';

export class QuestionGetDto {
  @vendors.classValidator.IsUUID()
  readonly id: string;
}
