"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnackFileExtensionsModel = exports.SnackFileTypesModel = exports.SnackFileCategoriesModel = exports.SnackFilesModel = exports.VerifiedsModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = require("mongoose");
//? Verifieds
let Verifieds = class Verifieds {
};
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Verifieds.prototype, "userId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true }),
    __metadata("design:type", Boolean)
], Verifieds.prototype, "ping", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], Verifieds.prototype, "pinedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Verifieds.prototype, "channelId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Verifieds.prototype, "verifiedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], Verifieds.prototype, "lastMentionAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true }),
    __metadata("design:type", Boolean)
], Verifieds.prototype, "contentHidden", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Boolean, required: true }),
    __metadata("design:type", Boolean)
], Verifieds.prototype, "channelHidden", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], Verifieds.prototype, "lastActivityAt", void 0);
Verifieds = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], Verifieds);
exports.VerifiedsModel = (0, typegoose_1.getModelForClass)(Verifieds);
let SnackFiles = class SnackFiles {
};
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SnackFiles.prototype, "url", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SnackFiles.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)([{ type: mongoose_1.SchemaTypes.ObjectId, required: true }]),
    __metadata("design:type", Array)
], SnackFiles.prototype, "categories", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SnackFiles.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], SnackFiles.prototype, "size", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], SnackFiles.prototype, "width", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], SnackFiles.prototype, "height", void 0);
SnackFiles = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], SnackFiles);
exports.SnackFilesModel = (0, typegoose_1.getModelForClass)(SnackFiles, {
    schemaOptions: {
        timestamps: true
    }
});
let SnackFileCategories = class SnackFileCategories {
};
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SnackFileCategories.prototype, "name", void 0);
SnackFileCategories = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], SnackFileCategories);
exports.SnackFileCategoriesModel = (0, typegoose_1.getModelForClass)(SnackFileCategories, {
    schemaOptions: {
        timestamps: true
    }
});
let SnackFileTypes = class SnackFileTypes {
};
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SnackFileTypes.prototype, "name", void 0);
SnackFileTypes = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], SnackFileTypes);
exports.SnackFileTypesModel = (0, typegoose_1.getModelForClass)(SnackFileTypes);
let SnackFileExtensions = class SnackFileExtensions {
};
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SnackFileExtensions.prototype, "name", void 0);
SnackFileExtensions = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], SnackFileExtensions);
exports.SnackFileExtensionsModel = (0, typegoose_1.getModelForClass)(SnackFileExtensions);
