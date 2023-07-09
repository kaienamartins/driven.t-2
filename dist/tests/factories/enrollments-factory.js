"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createhAddressWithCEP = exports.createEnrollmentWithAddress = void 0;
const faker_1 = __importDefault(require("@faker-js/faker"));
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const users_factory_1 = require("./users-factory");
const config_1 = require("@/config");
async function createEnrollmentWithAddress(user) {
    const incomingUser = user || (await users_factory_1.createUser());
    return config_1.prisma.enrollment.create({
        data: {
            name: faker_1.default.name.findName(),
            cpf: brazilian_utils_1.generateCPF(),
            birthday: faker_1.default.date.past(),
            phone: faker_1.default.phone.phoneNumber('(##) 9####-####'),
            userId: incomingUser.id,
            Address: {
                create: {
                    street: faker_1.default.address.streetName(),
                    cep: faker_1.default.address.zipCode(),
                    city: faker_1.default.address.city(),
                    neighborhood: faker_1.default.address.city(),
                    number: faker_1.default.datatype.number().toString(),
                    state: faker_1.default.helpers.arrayElement(brazilian_utils_1.getStates()).name,
                },
            },
        },
        include: {
            Address: true,
        },
    });
}
exports.createEnrollmentWithAddress = createEnrollmentWithAddress;
function createhAddressWithCEP() {
    return {
        logradouro: 'Avenida Brigadeiro Faria Lima',
        complemento: 'de 3252 ao fim - lado par',
        bairro: 'Itaim Bibi',
        cidade: 'São Paulo',
        uf: 'SP',
    };
}
exports.createhAddressWithCEP = createhAddressWithCEP;
