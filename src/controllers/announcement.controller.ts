import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares/authorization.middleware';
import { UserRole } from '@prisma/client';
import { validate, wrapper } from '@jmrl23/express-helper';
import { AnnouncementListDto } from '../dtos/announcement-list.dto';
import { AnnouncementService } from '../services/announcement.service';
import { AnnouncementGetDto } from '../dtos/announcement-get.dto';
import { AnnouncementUpdateDto } from '../dtos/announcement-update.dto';
import { AnnouncementDeleteDto } from '../dtos/announcement-delete.dto';
import { AnnouncementCreateDto } from '../dtos/announcement-create.dto';

export const controller = Router();

controller

  .get(
    '/get/:id',
    validate('PARAMS', AnnouncementGetDto),
    wrapper(async function (request) {
      const announcementService = await AnnouncementService.getInstance();
      const announcement = await announcementService.getById(request.params.id);

      return {
        announcement,
      };
    }),
  )

  .post(
    '/list',
    validate('BODY', AnnouncementListDto),
    wrapper(async function (request) {
      const announcementService = await AnnouncementService.getInstance();
      const announcements = await announcementService.list(request.body);

      return {
        announcements,
      };
    }),
  )

  .use(authorizationMiddleware(UserRole.ADMIN))

  .post(
    '/create',
    validate('BODY', AnnouncementCreateDto),
    wrapper(async function (request) {
      const announcementService = await AnnouncementService.getInstance();
      const announcement = await announcementService.create(
        request.user?.id,
        request.body,
      );

      return {
        announcement,
      };
    }),
  )

  .patch(
    '/update',
    validate('BODY', AnnouncementUpdateDto),
    wrapper(async function (request) {
      const announcementService = await AnnouncementService.getInstance();
      const announcement = await announcementService.update(request.body);

      return {
        announcement,
      };
    }),
  )

  .delete(
    '/delete/:id',
    validate('PARAMS', AnnouncementDeleteDto),
    wrapper(async function (request) {
      const announcementService = await AnnouncementService.getInstance();
      const announcement = await announcementService.delete(request.params.id);

      return {
        announcement,
      };
    }),
  );
