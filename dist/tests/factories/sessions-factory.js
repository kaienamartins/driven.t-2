"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = void 0;
const users_factory_1 = require("./users-factory");
const config_1 = require("@/config");
async function createSession(token) {
    const user = await users_factory_1.createUser();
    return config_1.prisma.session.create({
        data: {
            token: token,
            userId: user.id,
        },
    });
}
exports.createSession = createSession;
