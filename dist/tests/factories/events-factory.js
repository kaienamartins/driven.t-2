"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const faker_1 = __importDefault(require("@faker-js/faker"));
const config_1 = require("@/config");
function createEvent(params = {}) {
    return config_1.prisma.event.create({
        data: {
            title: params.title || faker_1.default.lorem.sentence(),
            backgroundImageUrl: params.backgroundImageUrl || faker_1.default.image.imageUrl(),
            logoImageUrl: params.logoImageUrl || faker_1.default.image.imageUrl(),
            startsAt: params.startsAt || dayjs_1.default().subtract(1, 'day').toDate(),
            endsAt: params.endsAt || dayjs_1.default().add(5, 'days').toDate(),
        },
    });
}
exports.createEvent = createEvent;
