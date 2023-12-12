import { vendors } from '@jmrl23/express-helper';

export class AssistantAskDto {
  @vendors.classValidator.IsString()
  @vendors.classValidator.Length(1)
  readonly content: string;
}
