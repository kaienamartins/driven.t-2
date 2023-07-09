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
const factories_1 = require("../factories");
const helpers_1 = require("../helpers");
const app_1 = require("@/app");
const config_1 = require("@/config");
const authentication_service_1 = __importStar(require("@/services/authentication-service"));
beforeAll(async () => {
    await app_1.init();
    await helpers_1.cleanDb();
});
describe('signIn', () => {
    const generateParams = () => ({
        email: faker_1.default.internet.email(),
        password: faker_1.default.internet.password(6),
    });
    it('should throw InvalidCredentialError if there is no user for given email', async () => {
        const params = generateParams();
        try {
            await authentication_service_1.default.signIn(params);
            fail('should throw InvalidCredentialError');
        }
        catch (error) {
            expect(error).toEqual(authentication_service_1.invalidCredentialsError());
        }
    });
    it('should throw InvalidCredentialError if given password is invalid', async () => {
        const params = generateParams();
        await factories_1.createUser({
            email: params.email,
            password: 'invalid-password',
        });
        try {
            await authentication_service_1.default.signIn(params);
            fail('should throw InvalidCredentialError');
        }
        catch (error) {
            expect(error).toEqual(authentication_service_1.invalidCredentialsError());
        }
    });
    describe('when email and password are valid', () => {
        it('should return user data if given email and password are valid', async () => {
            const params = generateParams();
            const user = await factories_1.createUser(params);
            const { user: signInUser } = await authentication_service_1.default.signIn(params);
            expect(user).toEqual(expect.objectContaining({
                id: signInUser.id,
                email: signInUser.email,
            }));
        });
        it('should create new session and return given token', async () => {
            const params = generateParams();
            const user = await factories_1.createUser(params);
            const { token: createdSessionToken } = await authentication_service_1.default.signIn(params);
            expect(createdSessionToken).toBeDefined();
            const session = await config_1.prisma.session.findFirst({
                where: {
                    token: createdSessionToken,
                    userId: user.id,
                },
            });
            expect(session).toBeDefined();
        });
    });
});
