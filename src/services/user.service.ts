import { vendors } from '@jmrl23/express-helper';
import { UserCreateDto } from '../dtos/user-create.dto';
import { UserSignInDto } from '../dtos/user-sign-in.dto';
import { CacheService } from './cache.service';
import { JwtService } from './jwt.service';
import { PrismaService } from './prisma.service';
import { UserUpdateDto } from '../dtos/user-update.dto';
import { User as PrismaUser, type PrismaClient } from '@prisma/client';
import { hash, genSalt, compare } from 'bcrypt';

export class UserService {
  private static instance: UserService;
  private prismaClient: PrismaClient;

  private constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
  ) {}

  public static async getInstance() {
    if (!UserService.instance) {
      const instance = new UserService(
        await PrismaService.getInstance(),
        await CacheService.getInstance(),
        await JwtService.getInstance(),
      );

      instance.prismaClient = await instance.prismaService.getClient();

      UserService.instance = instance;
    }

    return UserService.instance;
  }

  public async create(
    userCreateDto: UserCreateDto,
  ): Promise<Partial<PrismaUser>> {
    const prismaClient = await this.prismaService.getClient();

    const existingUser = await prismaClient.user.findUnique({
      where: {
        username: userCreateDto.username,
      },
    });

    if (existingUser) {
      throw new vendors.httpErrors.Conflict('Username already taken');
    }

    const user: Partial<PrismaUser> = await prismaClient.user.create({
      data: {
        username: userCreateDto.username,
        password: await this.hashPassword(userCreateDto.password),
        role: userCreateDto.role,
      },
    });

    delete user.password;

    this.cacheService.set(`UserService[user][${user.id}]`, user);

    return user;
  }

  public async update(
    userUpdateDto: UserUpdateDto,
  ): Promise<Partial<PrismaUser>> {
    const user: Partial<PrismaUser> = await this.prismaClient.user.update({
      where: {
        id: userUpdateDto.id,
      },
      data: {
        password: userUpdateDto.password
          ? await this.hashPassword(userUpdateDto.password)
          : void 0,
        role: userUpdateDto.role,
      },
    });

    delete user.password;

    await this.cacheService.set(`UserService[user][${user.id}]`, user);

    return user;
  }

  public async signIn(userSignInDto: UserSignInDto): Promise<string> {
    const user = await this.prismaClient.user.findFirst({
      where: {
        username: userSignInDto.username,
      },
    });

    if (!user) {
      throw new vendors.httpErrors.Unauthorized('User not exists');
    }

    if (!(await this.comparePassword(userSignInDto.password, user.password))) {
      throw new vendors.httpErrors.Unauthorized('Password is incorrect');
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '7d',
      },
    );

    return token;
  }

  public async getUserByToken(token: string): Promise<User | null> {
    const jwtResult = this.jwtService.verify<{ id: string }>(token);

    if (!jwtResult?.id) return null;

    const user: Partial<User> | null = await this.prismaClient.user.findUnique({
      where: {
        id: jwtResult.id,
      },
    });

    if (user) {
      delete (user as Partial<PrismaUser>).password;

      await this.cacheService.set(`UserService[user][${user.id}]`, user);
    }

    return (user as User) ?? null;
  }

  private async hashPassword(plain: string): Promise<string> {
    const salt = await genSalt(3);
    const hashedPassword = await hash(plain, salt);

    return hashedPassword;
  }

  private async comparePassword(
    plain: string,
    hashed: string,
  ): Promise<boolean> {
    const result = await compare(plain, hashed);

    return result;
  }
}
