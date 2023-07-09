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
describe('GET /payments', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/payments');
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker_1.default.lorem.word();
        const response = await server.get('/payments').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await factories_1.createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.get('/payments').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with status 400 if query param ticketId is missing', async () => {
            const token = await helpers_1.generateValidToken();
            const response = await server.get('/payments').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.BAD_REQUEST);
        });
        it('should respond with status 404 when given ticket doesnt exist', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            await factories_1.createEnrollmentWithAddress(user);
            const response = await server.get('/payments?ticketId=1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.NOT_FOUND);
        });
        it('should respond with status 401 when user doesnt own given ticket', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            await factories_1.createEnrollmentWithAddress(user);
            const ticketType = await factories_1.createTicketType();
            const otherUser = await factories_1.createUser();
            const otherUserEnrollment = await factories_1.createEnrollmentWithAddress(otherUser);
            const ticket = await factories_1.createTicket(otherUserEnrollment.id, ticketType.id, client_1.TicketStatus.RESERVED);
            const response = await server.get(`/payments?ticketId=${ticket.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.UNAUTHORIZED);
        });
        it('should respond with status 200 and with payment data', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            const enrollment = await factories_1.createEnrollmentWithAddress(user);
            const ticketType = await factories_1.createTicketType();
            const ticket = await factories_1.createTicket(enrollment.id, ticketType.id, client_1.TicketStatus.RESERVED);
            const payment = await factories_1.createPayment(ticket.id, ticketType.price);
            const response = await server.get(`/payments?ticketId=${ticket.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.OK);
            expect(response.body).toEqual({
                id: expect.any(Number),
                ticketId: ticket.id,
                value: ticketType.price,
                cardIssuer: payment.cardIssuer,
                cardLastDigits: payment.cardLastDigits,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });
    });
});
describe('POST /payments/process', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/payments/process');
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker_1.default.lorem.word();
        const response = await server.post('/payments/process').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await factories_1.createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.post('/payments/process').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with status 400 if body param ticketId is missing', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            const enrollment = await factories_1.createEnrollmentWithAddress(user);
            const ticketType = await factories_1.createTicketType();
            await factories_1.createTicket(enrollment.id, ticketType.id, client_1.TicketStatus.RESERVED);
            const body = { cardData: factories_1.generateCreditCardData() };
            const response = await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);
            expect(response.status).toEqual(http_status_1.default.BAD_REQUEST);
        });
        it('should respond with status 400 if body param cardData is missing', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            const enrollment = await factories_1.createEnrollmentWithAddress(user);
            const ticketType = await factories_1.createTicketType();
            const ticket = await factories_1.createTicket(enrollment.id, ticketType.id, client_1.TicketStatus.RESERVED);
            const body = { ticketId: ticket };
            const response = await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);
            expect(response.status).toEqual(http_status_1.default.BAD_REQUEST);
        });
        it('should respond with status 404 when given ticket doesnt exist', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            await factories_1.createEnrollmentWithAddress(user);
            const body = { ticketId: 1, cardData: factories_1.generateCreditCardData() };
            const response = await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);
            expect(response.status).toEqual(http_status_1.default.NOT_FOUND);
        });
        it('should respond with status 401 when user doesnt own given ticket', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            await factories_1.createEnrollmentWithAddress(user);
            const ticketType = await factories_1.createTicketType();
            const otherUser = await factories_1.createUser();
            const otherUserEnrollment = await factories_1.createEnrollmentWithAddress(otherUser);
            const ticket = await factories_1.createTicket(otherUserEnrollment.id, ticketType.id, client_1.TicketStatus.RESERVED);
            const body = { ticketId: ticket.id, cardData: factories_1.generateCreditCardData() };
            const response = await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);
            expect(response.status).toEqual(http_status_1.default.UNAUTHORIZED);
        });
        it('should respond with status 200 and with payment data', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            const enrollment = await factories_1.createEnrollmentWithAddress(user);
            const ticketType = await factories_1.createTicketType();
            const ticket = await factories_1.createTicket(enrollment.id, ticketType.id, client_1.TicketStatus.RESERVED);
            const body = { ticketId: ticket.id, cardData: factories_1.generateCreditCardData() };
            const response = await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);
            expect(response.status).toEqual(http_status_1.default.OK);
            expect(response.body).toEqual({
                id: expect.any(Number),
                ticketId: ticket.id,
                value: ticketType.price,
                cardIssuer: body.cardData.issuer,
                cardLastDigits: body.cardData.number.slice(-4),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });
        it('should insert a new payment in the database', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            const enrollment = await factories_1.createEnrollmentWithAddress(user);
            const ticketType = await factories_1.createTicketType();
            const ticket = await factories_1.createTicket(enrollment.id, ticketType.id, client_1.TicketStatus.RESERVED);
            const beforeCount = await config_1.prisma.payment.count();
            const body = { ticketId: ticket.id, cardData: factories_1.generateCreditCardData() };
            await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);
            const afterCount = await config_1.prisma.payment.count();
            expect(beforeCount).toEqual(0);
            expect(afterCount).toEqual(1);
        });
        it('should set ticket status as PAID', async () => {
            const user = await factories_1.createUser();
            const token = await helpers_1.generateValidToken(user);
            const enrollment = await factories_1.createEnrollmentWithAddress(user);
            const ticketType = await factories_1.createTicketType();
            const ticket = await factories_1.createTicket(enrollment.id, ticketType.id, client_1.TicketStatus.RESERVED);
            const body = { ticketId: ticket.id, cardData: factories_1.generateCreditCardData() };
            await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);
            const updatedTicket = await config_1.prisma.ticket.findUnique({ where: { id: ticket.id } });
            expect(updatedTicket.status).toEqual(client_1.TicketStatus.PAID);
        });
    });
});
