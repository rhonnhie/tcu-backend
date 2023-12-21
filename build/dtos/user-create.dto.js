"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreateDto = void 0;
const express_helper_1 = require("@jmrl23/express-helper");
const client_1 = require("@prisma/client");
class UserCreateDto {
}
exports.UserCreateDto = UserCreateDto;
__decorate([
    express_helper_1.vendors.classValidator.IsString(),
    express_helper_1.vendors.classValidator.Matches('^[a-zA-Z0-9_]{4,}[0-9]*$', void 0, {
        message: 'Invalid username',
    })
], UserCreateDto.prototype, "username", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsString(),
    express_helper_1.vendors.classValidator.Length(8)
], UserCreateDto.prototype, "password", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsEnum(client_1.UserRole)
], UserCreateDto.prototype, "role", void 0);
