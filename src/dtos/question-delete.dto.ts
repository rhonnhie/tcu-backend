import { vendors } from '@jmrl23/express-helper';

export class QuestionDeleteDto {
  @vendors.classValidator.IsUUID()
  readonly id: string;
}
