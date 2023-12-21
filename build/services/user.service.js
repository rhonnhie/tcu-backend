"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const express_helper_1 = require("@jmrl23/express-helper");
const cache_service_1 = require("./cache.service");
const jwt_service_1 = require("./jwt.service");
const prisma_service_1 = require("./prisma.service");
const bcrypt_1 = require("bcrypt");
class UserService {
    constructor(prismaService, cacheService, jwtService) {
        this.prismaService = prismaService;
        this.cacheService = cacheService;
        this.jwtService = jwtService;
    }
    static async getInstance() {
        if (!UserService.instance) {
            const instance = new UserService(await prisma_service_1.PrismaService.getInstance(), await cache_service_1.CacheService.getInstance(), await jwt_service_1.JwtService.getInstance());
            instance.prismaClient = await instance.prismaService.getClient();
            UserService.instance = instance;
        }
        return UserService.instance;
    }
    async create(userCreateDto) {
        const prismaClient = await this.prismaService.getClient();
        const existingUser = await prismaClient.user.findUnique({
            where: {
                username: userCreateDto.username,
            },
        });
        if (existingUser) {
            throw new express_helper_1.vendors.httpErrors.Conflict('Username already taken');
        }
        const user = await prismaClient.user.create({
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
    async update(userUpdateDto) {
        const user = await this.prismaClient.user.update({
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
    async signIn(userSignInDto) {
        const user = await this.prismaClient.user.findFirst({
            where: {
                username: userSignInDto.username,
            },
        });
        if (!user) {
            throw new express_helper_1.vendors.httpErrors.Unauthorized('User not exists');
        }
        if (!(await this.comparePassword(userSignInDto.password, user.password))) {
            throw new express_helper_1.vendors.httpErrors.Unauthorized('Password is incorrect');
        }
        const token = this.jwtService.sign({
            id: user.id,
        }, {
            expiresIn: '7d',
        });
        return token;
    }
    async getUserByToken(token) {
        var _a;
        const jwtResult = this.jwtService.verify(token);
        if (!(jwtResult === null || jwtResult === void 0 ? void 0 : jwtResult.id))
            return null;
        const user = await this.prismaClient.user.findUnique({
            where: {
                id: jwtResult.id,
            },
        });
        if (user) {
            delete user.password;
            await this.cacheService.set(`UserService[user][${user.id}]`, user);
        }
        return (_a = user) !== null && _a !== void 0 ? _a : null;
    }
    async hashPassword(plain) {
        const salt = await (0, bcrypt_1.genSalt)(3);
        const hashedPassword = await (0, bcrypt_1.hash)(plain, salt);
        return hashedPassword;
    }
    async comparePassword(plain, hashed) {
        const result = await (0, bcrypt_1.compare)(plain, hashed);
        return result;
    }
}
exports.UserService = UserService;
