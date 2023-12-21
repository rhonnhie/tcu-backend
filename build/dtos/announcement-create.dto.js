"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementCreateDto = void 0;
const express_helper_1 = require("@jmrl23/express-helper");
class AnnouncementCreateDto {
}
exports.AnnouncementCreateDto = AnnouncementCreateDto;
__decorate([
    express_helper_1.vendors.classValidator.IsString(),
    express_helper_1.vendors.classValidator.Length(1)
], AnnouncementCreateDto.prototype, "title", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsString(),
    express_helper_1.vendors.classValidator.Length(1)
], AnnouncementCreateDto.prototype, "content", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsOptional(),
    express_helper_1.vendors.classValidator.IsUUID('4')
], AnnouncementCreateDto.prototype, "photo_id", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsOptional(),
    express_helper_1.vendors.classValidator.IsArray(),
    express_helper_1.vendors.classValidator.IsUUID('4', { each: true })
], AnnouncementCreateDto.prototype, "attachments", void 0);
