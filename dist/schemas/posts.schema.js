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
exports.PostsSchema = exports.Posts = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Posts = class Posts {
    title;
    description;
    tags;
    price;
    presentation_card_id;
    images;
    is_archived;
    is_deleted;
    is_anonymous;
    seller_id;
    stars_amount;
};
exports.Posts = Posts;
__decorate([
    (0, mongoose_1.Prop)({
        trim: true,
        required: true,
    }),
    __metadata("design:type", String)
], Posts.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Posts.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Array)
], Posts.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
    }),
    __metadata("design:type", Number)
], Posts.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Posts.prototype, "presentation_card_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", Array)
], Posts.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Posts.prototype, "is_archived", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Posts.prototype, "is_deleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Posts.prototype, "is_anonymous", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Posts.prototype, "seller_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        min: 0,
        max: 5,
    }),
    __metadata("design:type", Number)
], Posts.prototype, "stars_amount", void 0);
exports.Posts = Posts = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Posts);
exports.PostsSchema = mongoose_1.SchemaFactory.createForClass(Posts);
//# sourceMappingURL=posts.schema.js.map