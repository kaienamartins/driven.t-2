"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicket = exports.createTicketType = void 0;
const faker_1 = __importDefault(require("@faker-js/faker"));
const config_1 = require("@/config");
async function createTicketType() {
    return config_1.prisma.ticketType.create({
        data: {
            name: faker_1.default.name.findName(),
            price: faker_1.default.datatype.number(),
            isRemote: faker_1.default.datatype.boolean(),
            includesHotel: faker_1.default.datatype.boolean(),
        },
    });
}
exports.createTicketType = createTicketType;
async function createTicket(enrollmentId, ticketTypeId, status) {
    return config_1.prisma.ticket.create({
        data: {
            enrollmentId,
            ticketTypeId,
            status,
        },
    });
}
exports.createTicket = createTicket;
