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
const http_status_1 = __importDefault(require("http-status"));
const supertest_1 = __importDefault(require("supertest"));
const factories_1 = require("../factories");
const helpers_1 = require("../helpers");
const app_1 = __importStar(require("@/app"));
beforeAll(async () => {
    await app_1.init();
    await helpers_1.cleanDb();
});
const server = supertest_1.default(app_1.default);
describe('POST /auth/sign-in', () => {
    it('should respond with status 400 when body is not given', async () => {
        const response = await server.post('/auth/sign-in');
        expect(response.status).toBe(http_status_1.default.BAD_REQUEST);
    });
    it('should respond with status 400 when body is not valid', async () => {
        const invalidBody = { [faker_1.default.lorem.word()]: faker_1.default.lorem.word() };
        const response = await server.post('/auth/sign-in').send(invalidBody);
        expect(response.status).toBe(http_status_1.default.BAD_REQUEST);
    });
    describe('when body is valid', () => {
        const generateValidBody = () => ({
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password(6),
        });
        it('should respond with status 401 if there is no user for given email', async () => {
            const body = generateValidBody();
            const response = await server.post('/auth/sign-in').send(body);
            expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
        });
        it('should respond with status 401 if there is a user for given email but password is not correct', async () => {
            const body = generateValidBody();
            await factories_1.createUser(body);
            const response = await server.post('/auth/sign-in').send({
                ...body,
                password: faker_1.default.lorem.word(),
            });
            expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
        });
        describe('when credentials are valid', () => {
            it('should respond with status 200', async () => {
                const body = generateValidBody();
                await factories_1.createUser(body);
                const response = await server.post('/auth/sign-in').send(body);
                expect(response.status).toBe(http_status_1.default.OK);
            });
            it('should respond with user data', async () => {
                const body = generateValidBody();
                const user = await factories_1.createUser(body);
                const response = await server.post('/auth/sign-in').send(body);
                expect(response.body.user).toEqual({
                    id: user.id,
                    email: user.email,
                });
            });
            it('should respond with session token', async () => {
                const body = generateValidBody();
                await factories_1.createUser(body);
                const response = await server.post('/auth/sign-in').send(body);
                expect(response.body.token).toBeDefined();
            });
        });
    });
});
