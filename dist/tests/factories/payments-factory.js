"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCreditCardData = exports.createPayment = void 0;
const faker_1 = __importDefault(require("@faker-js/faker"));
const config_1 = require("@/config");
async function createPayment(ticketId, value) {
    return config_1.prisma.payment.create({
        data: {
            ticketId,
            value,
            cardIssuer: faker_1.default.name.findName(),
            cardLastDigits: faker_1.default.datatype.number({ min: 1000, max: 9999 }).toString(),
        },
    });
}
exports.createPayment = createPayment;
function generateCreditCardData() {
    const futureDate = faker_1.default.date.future();
    return {
        issuer: faker_1.default.name.findName(),
        number: faker_1.default.datatype.number({ min: 100000000000000, max: 999999999999999 }).toString(),
        name: faker_1.default.name.findName(),
        expirationDate: `${futureDate.getMonth() + 1}/${futureDate.getFullYear()}`,
        cvv: faker_1.default.datatype.number({ min: 100, max: 999 }).toString(),
    };
}
exports.generateCreditCardData = generateCreditCardData;
