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
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const jwt = __importStar(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const factories_1 = require("../factories");
const helpers_1 = require("../helpers");
const config_1 = require("@/config");
const app_1 = __importStar(require("@/app"));
beforeAll(async () => {
    await app_1.init();
});
beforeEach(async () => {
    await helpers_1.cleanDb();
});
const server = supertest_1.default(app_1.default);
describe('GET /tickets/types', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/tickets/types');
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker_1.default.lorem.word();
        const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await factories_1.createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with empty array when there are no ticket types created', async () => {
            const token = await helpers_1.generateValidToken();
            const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);
            expect(response.body).toEqual([]);
        });
        it('should respond with status 200 and with existing TicketTypes data', async () => {
            const token = await helpers_1.generateValidToken();
            const ticketType = await factories_1.createTicketType();
            const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(http_status_1.default.OK);
            expect(response.body).toEqual([
                {
                    id: ticketType.id,
                    name: ticketType.name,
                    price: ticketType.price,
                    isRemote: ticketType.isRemote,
                    includesHotel: ticketType.includesHotel,
                    createdAt: ticketType.createdAt.toISOString(),
                    updatedAt: ticketType.updatedAt.toISOString(),
                },
            ]);
        });
    });
});
describe('GET /tickets', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/tickets');
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker_1.default.lorem.word();
        const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await factories_1.createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
            const token = await helpers_1.generateValidToken();
            const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.NOT_FOUND);
        });
        it('should respond with status 404 when user doesnt have a ticket yet', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            await factories_1.createEnrollmentWithAddress(user);
            const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.NOT_FOUND);
        });
        it('should respond with status 200 and with ticket data', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            const enrollment = await factories_1.createEnrollmentWithAddress(user);
            const ticketType = await factories_1.createTicketType();
            const ticket = await factories_1.createTicket(enrollment.id, ticketType.id, client_1.TicketStatus.RESERVED);
            const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.OK);
            expect(response.body).toEqual({
                id: ticket.id,
                status: ticket.status,
                ticketTypeId: ticket.ticketTypeId,
                enrollmentId: ticket.enrollmentId,
                TicketType: {
                    id: ticketType.id,
                    name: ticketType.name,
                    price: ticketType.price,
                    isRemote: ticketType.isRemote,
                    includesHotel: ticketType.includesHotel,
                    createdAt: ticketType.createdAt.toISOString(),
                    updatedAt: ticketType.updatedAt.toISOString(),
                },
                createdAt: ticket.createdAt.toISOString(),
                updatedAt: ticket.updatedAt.toISOString(),
            });
        });
    });
});
describe('POST /tickets', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/tickets');
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker_1.default.lorem.word();
        const response = await server.post('/tickets').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await factories_1.createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.post('/tickets').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with status 400 when ticketTypeId is not present in body', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            await factories_1.createEnrollmentWithAddress(user);
            await factories_1.createTicketType();
            const response = await server.post('/tickets').set('Authorization', `Bearer ${token}`).send({});
            expect(response.status).toEqual(http_status_1.default.BAD_REQUEST);
        });
        it('should respond with status 404 when user doesnt have enrollment yet', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            const ticketType = await factories_1.createTicketType();
            const response = await server
                .post('/tickets')
                .set('Authorization', `Bearer ${token}`)
                .send({ ticketTypeId: ticketType.id });
            expect(response.status).toEqual(http_status_1.default.NOT_FOUND);
        });
        it('should respond with status 201 and with ticket data', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            const enrollment = await factories_1.createEnrollmentWithAddress(user);
            const ticketType = await factories_1.createTicketType();
            const response = await server
                .post('/tickets')
                .set('Authorization', `Bearer ${token}`)
                .send({ ticketTypeId: ticketType.id });
            expect(response.status).toEqual(http_status_1.default.CREATED);
            expect(response.body).toEqual({
                id: expect.any(Number),
                status: client_1.TicketStatus.RESERVED,
                ticketTypeId: ticketType.id,
                enrollmentId: enrollment.id,
                TicketType: {
                    id: ticketType.id,
                    name: ticketType.name,
                    price: ticketType.price,
                    isRemote: ticketType.isRemote,
                    includesHotel: ticketType.includesHotel,
                    createdAt: ticketType.createdAt.toISOString(),
                    updatedAt: ticketType.updatedAt.toISOString(),
                },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });
        it('should insert a new ticket in the database', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            await factories_1.createEnrollmentWithAddress(user);
            const ticketType = await factories_1.createTicketType();
            const beforeCount = await config_1.prisma.ticket.count();
            await server.post('/tickets').set('Authorization', `Bearer ${token}`).send({ ticketTypeId: ticketType.id });
            const afterCount = await config_1.prisma.ticket.count();
            expect(beforeCount).toEqual(0);
            expect(afterCount).toEqual(1);
        });
    });
});
