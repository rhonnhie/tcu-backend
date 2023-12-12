import { validate, wrapper } from '@jmrl23/express-helper';
import { Router } from 'express';
import { AssistantAskDto } from '../dtos/assistant-ask.dto';
import { AssistantService } from '../services/assistant.service';

export const controller = Router();

controller.post(
  '/ask',
  validate('BODY', AssistantAskDto),
  wrapper(async function (request) {
    const assistantService = await AssistantService.getInstance();
    const data = await assistantService.ask(request.body);

    return {
      data,
    };
  }),
);
