import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares/authorization.middleware';
import { UserRole } from '@prisma/client';
import { validate, wrapper } from '@jmrl23/express-helper';
import { QuestionListDto } from '../dtos/question-list.dto';
import { QuestionService } from '../services/question.service';
import { QuestionGetDto } from '../dtos/question-get.dto';
import { QuestionUpdateDto } from '../dtos/question-update.dto';
import { QuestionDeleteDto } from '../dtos/question-delete.dto';
import { QuestionCreateDto } from '../dtos/question-create.dto';

export const controller = Router();

controller

  .get(
    '/get/:id',
    validate('PARAMS', QuestionGetDto),
    wrapper(async function (request) {
      const questionService = await QuestionService.getInstance();
      const question = await questionService.getById(request.params.id);

      return {
        question,
      };
    }),
  )

  .post(
    '/list',
    validate('BODY', QuestionListDto),
    wrapper(async function (request) {
      const questionService = await QuestionService.getInstance();
      const questions = await questionService.list(request.body);

      return {
        questions,
      };
    }),
  )

  .use(authorizationMiddleware(UserRole.ADMIN))

  .post(
    '/create',
    validate('BODY', QuestionCreateDto),
    wrapper(async function (request) {
      const questionService = await QuestionService.getInstance();
      const question = await questionService.create(
        request.user?.id,
        request.body,
      );

      return {
        question,
      };
    }),
  )

  .patch(
    '/update',
    validate('BODY', QuestionUpdateDto),
    wrapper(async function (request) {
      const questionService = await QuestionService.getInstance();
      const question = await questionService.update(request.body);

      return {
        question,
      };
    }),
  )

  .delete(
    '/delete/:id',
    validate('PARAMS', QuestionDeleteDto),
    wrapper(async function (request) {
      const questionService = await QuestionService.getInstance();
      const question = await questionService.delete(request.params.id);

      return {
        question,
      };
    }),
  );
