"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("@faker-js/faker"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const factories_1 = require("../factories");
const helpers_1 = require("../helpers");
const users_service_1 = __importStar(require("@/services/users-service"));
const config_1 = require("@/config");
const app_1 = require("@/app");
beforeAll(async () => {
    await app_1.init();
    await helpers_1.cleanDb();
});
describe('createUser', () => {
    it('should throw duplicatedUserError if there is a user with given email', async () => {
        const existingUser = await factories_1.createUser();
        await factories_1.createEvent();
        try {
            await users_service_1.default.createUser({
                email: existingUser.email,
                password: faker_1.default.internet.password(6),
            });
            fail('should throw duplicatedUserError');
        }
        catch (error) {
            expect(error).toEqual(users_service_1.duplicatedEmailError());
        }
    });
    it('should create user when given email is unique', async () => {
        const user = await users_service_1.default.createUser({
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password(6),
        });
        const dbUser = await config_1.prisma.user.findUnique({
            where: {
                id: user.id,
            },
        });
        expect(user).toEqual(expect.objectContaining({
            id: dbUser.id,
            email: dbUser.email,
        }));
    });
    it('should hash user password', async () => {
        const rawPassword = faker_1.default.internet.password(6);
        const user = await users_service_1.default.createUser({
            email: faker_1.default.internet.email(),
            password: rawPassword,
        });
        const dbUser = await config_1.prisma.user.findUnique({
            where: {
                id: user.id,
            },
        });
        expect(dbUser.password).not.toBe(rawPassword);
        expect(await bcrypt_1.default.compare(rawPassword, dbUser.password)).toBe(true);
    });
});
