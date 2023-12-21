"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementListDto = void 0;
const express_helper_1 = require("@jmrl23/express-helper");
class AnnouncementListDto {
}
exports.AnnouncementListDto = AnnouncementListDto;
__decorate([
    express_helper_1.vendors.classValidator.IsOptional(),
    express_helper_1.vendors.classValidator.IsDateString()
], AnnouncementListDto.prototype, "created_at_from", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsOptional(),
    express_helper_1.vendors.classValidator.IsDateString()
], AnnouncementListDto.prototype, "created_at_to", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsOptional(),
    express_helper_1.vendors.classValidator.IsDateString()
], AnnouncementListDto.prototype, "updated_at_from", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsOptional(),
    express_helper_1.vendors.classValidator.IsDateString()
], AnnouncementListDto.prototype, "updated_at_to", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsOptional(),
    express_helper_1.vendors.classValidator.IsString({ each: true }),
    express_helper_1.vendors.classValidator.Length(1, undefined, { each: true })
], AnnouncementListDto.prototype, "keywords", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsOptional(),
    express_helper_1.vendors.classValidator.IsBoolean()
], AnnouncementListDto.prototype, "pin", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsOptional(),
    express_helper_1.vendors.classValidator.IsUUID()
], AnnouncementListDto.prototype, "user_id", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsOptional(),
    express_helper_1.vendors.classValidator.IsInt()
], AnnouncementListDto.prototype, "skip", void 0);
__decorate([
    express_helper_1.vendors.classValidator.IsOptional(),
    express_helper_1.vendors.classValidator.IsInt()
], AnnouncementListDto.prototype, "take", void 0);
