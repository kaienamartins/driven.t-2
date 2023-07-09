"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("@/utils/request");
const errors_1 = require("@/errors");
const address_repository_1 = __importDefault(require("@/repositories/address-repository"));
const enrollment_repository_1 = __importDefault(require("@/repositories/enrollment-repository"));
const prisma_utils_1 = require("@/utils/prisma-utils");
async function getAddressFromCEP(cep) {
    const result = await request_1.request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);
    if (!result.data || result.data.erro) {
        throw errors_1.notFoundError();
    }
    const { bairro, localidade, uf, complemento, logradouro } = result.data;
    const address = {
        bairro,
        cidade: localidade,
        uf,
        complemento,
        logradouro,
    };
    return address;
}
async function getOneWithAddressByUserId(userId) {
    const enrollmentWithAddress = await enrollment_repository_1.default.findWithAddressByUserId(userId);
    if (!enrollmentWithAddress)
        throw errors_1.notFoundError();
    const [firstAddress] = enrollmentWithAddress.Address;
    const address = getFirstAddress(firstAddress);
    return {
        ...prisma_utils_1.exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
        ...(!!address && { address }),
    };
}
function getFirstAddress(firstAddress) {
    if (!firstAddress)
        return null;
    return prisma_utils_1.exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}
async function createOrUpdateEnrollmentWithAddress(params) {
    const enrollment = prisma_utils_1.exclude(params, 'address');
    const address = getAddressForUpsert(params.address);
    await getAddressFromCEP(address.cep);
    const newEnrollment = await enrollment_repository_1.default.upsert(params.userId, enrollment, prisma_utils_1.exclude(enrollment, 'userId'));
    await address_repository_1.default.upsert(newEnrollment.id, address, address);
}
function getAddressForUpsert(address) {
    return {
        ...address,
        ...(address?.addressDetail && { addressDetail: address.addressDetail }),
    };
}
const enrollmentsService = {
    getOneWithAddressByUserId,
    createOrUpdateEnrollmentWithAddress,
    getAddressFromCEP,
};
exports.default = enrollmentsService;
