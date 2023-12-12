import type { Prisma } from '@prisma/client';

declare global {
  declare namespace Express {
    interface Request {
      user?: User;
    }
  }

  declare type User = Omit<Prisma.UserGetPayload<>, 'password'>;

  declare type DriveFile = {
    path: string;
    name: string;
    data: {
      kind: string;
      id: string;
      name: string;
      mimeType: string;
    };
  };

  declare type AiMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
  };
}
