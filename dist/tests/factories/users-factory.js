"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const faker_1 = __importDefault(require("@faker-js/faker"));
const config_1 = require("@/config");
async function createUser(params = {}) {
    const incomingPassword = params.password || faker_1.default.internet.password(6);
    const hashedPassword = await bcrypt_1.default.hash(incomingPassword, 10);
    return config_1.prisma.user.create({
        data: {
            email: params.email || faker_1.default.internet.email(),
            password: hashedPassword,
        },
    });
}
exports.createUser = createUser;
