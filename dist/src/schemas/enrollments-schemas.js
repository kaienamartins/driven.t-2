"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnrollmentSchema = void 0;
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const joi_1 = __importDefault(require("joi"));
const cpfValidationSchema = joi_1.default.string().length(11).custom(joiCpfValidation).required();
const cepValidationSchema = joi_1.default.string().length(9).custom(JoiCepValidation).required();
const mobilePhoneValidationSchema = joi_1.default.string().min(14).max(15).custom(joiMobilePhoneValidation).required();
exports.createEnrollmentSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    cpf: cpfValidationSchema,
    birthday: joi_1.default.string().isoDate().required(),
    phone: mobilePhoneValidationSchema,
    address: joi_1.default.object({
        cep: cepValidationSchema,
        street: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        number: joi_1.default.string().required(),
        state: joi_1.default.string()
            .length(2)
            .valid(...brazilian_utils_1.getStates().map((s) => s.code))
            .required(),
        neighborhood: joi_1.default.string().required(),
        addressDetail: joi_1.default.string().allow(null, ''),
    }).required(),
});
function joiCpfValidation(value, helpers) {
    if (!value)
        return value;
    if (!brazilian_utils_1.isValidCPF(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}
function JoiCepValidation(value, helpers) {
    if (!value)
        return value;
    if (!brazilian_utils_1.isValidCEP(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}
function joiMobilePhoneValidation(value, helpers) {
    if (!value)
        return value;
    if (!brazilian_utils_1.isValidMobilePhone(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}
