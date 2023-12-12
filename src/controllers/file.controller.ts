import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares/authorization.middleware';
import { UserRole } from '@prisma/client';
import { FileService } from '../services/file.service';
import { validate, wrapper } from '@jmrl23/express-helper';
import { DriveService } from '../services/drive.service';
import { FileGetDto } from '../dtos/file-get.dto';

export const controller = Router();

controller
  .post(
    '/upload',
    authorizationMiddleware(UserRole.ADMIN),
    FileService.multer().array('files'),
    wrapper(async function (request) {
      const fileService = await FileService.getInstance();
      const files = await fileService.upload(
        request.user?.id,
        (request.files as Express.Multer.File[]) || [],
      );

      return {
        files,
      };
    }),
  )

  .get(
    '/get/:id/:name',
    validate('PARAMS', FileGetDto),
    wrapper(async function (request, response) {
      const fileService = await FileService.getInstance();
      const { file } = await fileService.file(
        request.params.id,
        request.params.name,
      );
      const driveService = await DriveService.getInstance();
      const fileStream = await driveService.file(file.file_id ?? '');

      response.setHeader('Content-Length', file.size);
      response.setHeader('Content-Type', file.mimetype);
      response.setHeader('Cache-Control', 'max-age=3600');
      fileStream.pipe(response);
    }),
  );
