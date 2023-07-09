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
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const faker_1 = __importDefault(require("@faker-js/faker"));
const dayjs_1 = __importDefault(require("dayjs"));
const http_status_1 = __importDefault(require("http-status"));
const jwt = __importStar(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const factories_1 = require("../factories");
const helpers_1 = require("../helpers");
const config_1 = require("@/config");
const app_1 = __importStar(require("@/app"));
beforeAll(async () => {
    await app_1.init();
    await helpers_1.cleanDb();
});
const server = supertest_1.default(app_1.default);
describe('GET /enrollments', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/enrollments');
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker_1.default.lorem.word();
        const response = await server.get('/enrollments').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await factories_1.createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.get('/enrollments').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with status 204 when there is no enrollment for given user', async () => {
            const token = await helpers_1.generateValidToken();
            const response = await server.get('/enrollments').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(http_status_1.default.NO_CONTENT);
        });
        it('should respond with status 200 and enrollment data with address when there is a enrollment for given user', async () => {
            const user = await factories_1.createUser();
            const enrollment = await factories_1.createEnrollmentWithAddress(user);
            const token = await helpers_1.generateValidToken(user);
            const response = await server.get('/enrollments').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(http_status_1.default.OK);
            expect(response.body).toEqual({
                id: enrollment.id,
                name: enrollment.name,
                cpf: enrollment.cpf,
                birthday: enrollment.birthday.toISOString(),
                phone: enrollment.phone,
                address: {
                    id: enrollment.Address[0].id,
                    cep: enrollment.Address[0].cep,
                    street: enrollment.Address[0].street,
                    city: enrollment.Address[0].city,
                    state: enrollment.Address[0].state,
                    number: enrollment.Address[0].number,
                    neighborhood: enrollment.Address[0].neighborhood,
                    addressDetail: enrollment.Address[0].addressDetail,
                },
            });
        });
    });
});
describe('GET /enrollments/cep', () => {
    it('should respond with status 200 when CEP is valid', async () => {
        const response = await server.get('/enrollments/cep?cep=04538132');
        const address = factories_1.createhAddressWithCEP();
        expect(response.status).toBe(http_status_1.default.OK);
        expect(response.body).toEqual(address);
    });
    it('should respond with status 204 when CEP is invalid', async () => {
        const response = await server.get('/enrollments/cep?cep=00');
        expect(response.status).toBe(http_status_1.default.NO_CONTENT);
    });
});
describe('POST /enrollments', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/enrollments');
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker_1.default.lorem.word();
        const response = await server.post('/enrollments').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await factories_1.createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.post('/enrollments').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with status 400 when body is not present', async () => {
            const token = await helpers_1.generateValidToken();
            const response = await server.post('/enrollments').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(http_status_1.default.BAD_REQUEST);
        });
        it('should respond with status 400 when body is not valid', async () => {
            const token = await helpers_1.generateValidToken();
            const body = { [faker_1.default.lorem.word()]: faker_1.default.lorem.word() };
            const response = await server.post('/enrollments').set('Authorization', `Bearer ${token}`).send(body);
            expect(response.status).toBe(http_status_1.default.BAD_REQUEST);
        });
        describe('when body is valid', () => {
            const generateValidBody = () => ({
                name: faker_1.default.name.findName(),
                cpf: brazilian_utils_1.generateCPF(),
                birthday: faker_1.default.date.past().toISOString(),
                phone: '(21) 98999-9999',
                address: {
                    cep: '90830-563',
                    street: faker_1.default.address.streetName(),
                    city: faker_1.default.address.city(),
                    number: faker_1.default.datatype.number().toString(),
                    state: faker_1.default.helpers.arrayElement(brazilian_utils_1.getStates()).code,
                    neighborhood: faker_1.default.address.secondaryAddress(),
                    addressDetail: faker_1.default.lorem.sentence(),
                },
            });
            it('should respond with status 201 and create new enrollment if there is not any', async () => {
                const body = generateValidBody();
                const token = await helpers_1.generateValidToken();
                const response = await server.post('/enrollments').set('Authorization', `Bearer ${token}`).send(body);
                expect(response.status).toBe(http_status_1.default.OK);
                const enrollment = await config_1.prisma.enrollment.findFirst({ where: { cpf: body.cpf } });
                expect(enrollment).toBeDefined();
            });
            it('should respond with status 200 and update enrollment if there is one already', async () => {
                const user = await factories_1.createUser();
                const enrollment = await factories_1.createEnrollmentWithAddress(user);
                const body = generateValidBody();
                const token = await helpers_1.generateValidToken(user);
                const response = await server.post('/enrollments').set('Authorization', `Bearer ${token}`).send(body);
                expect(response.status).toBe(http_status_1.default.OK);
                const updatedEnrollment = await config_1.prisma.enrollment.findUnique({ where: { userId: user.id } });
                const addresses = await config_1.prisma.address.findMany({ where: { enrollmentId: enrollment.id } });
                expect(addresses.length).toEqual(1);
                expect(updatedEnrollment).toBeDefined();
                expect(updatedEnrollment).toEqual(expect.objectContaining({
                    name: body.name,
                    cpf: body.cpf,
                    birthday: dayjs_1.default(body.birthday).toDate(),
                    phone: body.phone,
                }));
            });
        });
        describe('when body is invalid', () => {
            const generateInvalidBody = () => ({
                name: faker_1.default.name.findName(),
                cpf: brazilian_utils_1.generateCPF(),
                birthday: faker_1.default.date.past().toISOString(),
                phone: '(21) 98999-9999',
                address: {
                    cep: '0',
                    street: faker_1.default.address.streetName(),
                    city: faker_1.default.address.city(),
                    number: faker_1.default.datatype.number().toString(),
                    state: faker_1.default.helpers.arrayElement(brazilian_utils_1.getStates()).code,
                    neighborhood: faker_1.default.address.secondaryAddress(),
                    addressDetail: faker_1.default.lorem.sentence(),
                },
            });
            it('should respond with status 400 and create new enrollment if there is not any', async () => {
                const body = generateInvalidBody();
                const token = await helpers_1.generateValidToken();
                const response = await server.post('/enrollments').set('Authorization', `Bearer ${token}`).send(body);
                expect(response.status).toBe(http_status_1.default.BAD_REQUEST);
            });
        });
    });
});
