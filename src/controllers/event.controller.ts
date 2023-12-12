import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares/authorization.middleware';
import { UserRole } from '@prisma/client';
import { validate, wrapper } from '@jmrl23/express-helper';
import { EventCreateDto } from '../dtos/event-create.dto';
import { EventService } from '../services/event.service';
import { EventGetDto } from '../dtos/event-get.dto';
import { EventListDto } from '../dtos/event-list.dto';
import { EventUpdateDto } from '../dtos/event-update.dto';
import { EventDeleteDto } from '../dtos/event-delete.dto';

export const controller = Router();

controller

  .get(
    '/get/:id',
    validate('PARAMS', EventGetDto),
    wrapper(async function (request) {
      const eventService = await EventService.getInstance();
      const event = await eventService.getById(request.params.id);

      return {
        event,
      };
    }),
  )

  .post(
    '/list',
    validate('BODY', EventListDto),
    wrapper(async function (request) {
      const eventService = await EventService.getInstance();
      const events = await eventService.list(request.body);

      return {
        events,
      };
    }),
  )

  .use(authorizationMiddleware(UserRole.ADMIN))

  .post(
    '/create',
    validate('BODY', EventCreateDto),
    wrapper(async function (request) {
      const eventService = await EventService.getInstance();
      const event = await eventService.create(request.user?.id, request.body);

      return {
        event,
      };
    }),
  )

  .patch(
    '/update',
    validate('BODY', EventUpdateDto),
    wrapper(async function (request) {
      const eventService = await EventService.getInstance();
      const event = await eventService.update(request.body);

      return {
        event,
      };
    }),
  )

  .delete(
    '/delete/:id',
    validate('PARAMS', EventDeleteDto),
    wrapper(async function (request) {
      const eventService = await EventService.getInstance();
      const event = await eventService.delete(request.params.id);

      return {
        event,
      };
    }),
  );
