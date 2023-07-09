"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("@faker-js/faker"));
const schemas_1 = require("@/schemas");
describe('createUserSchema', () => {
    const generateValidInput = () => ({
        email: faker_1.default.internet.email(),
        password: faker_1.default.internet.password(6),
    });
    describe('when email is not valid', () => {
        it('should return error if email is not present', () => {
            const input = generateValidInput();
            delete input.email;
            const { error } = schemas_1.createUserSchema.validate(input);
            expect(error).toBeDefined();
        });
        it('should return error if email does not follow valid email format', () => {
            const input = generateValidInput();
            input.email = faker_1.default.lorem.word();
            const { error } = schemas_1.createUserSchema.validate(input);
            expect(error).toBeDefined();
        });
    });
    describe('when password is not valid', () => {
        it('should return error if password is not present', () => {
            const input = generateValidInput();
            delete input.password;
            const { error } = schemas_1.createUserSchema.validate(input);
            expect(error).toBeDefined();
        });
        it('should return error if password is shorter than 6 characters', () => {
            const input = generateValidInput();
            input.password = faker_1.default.lorem.word(5);
            const { error } = schemas_1.createUserSchema.validate(input);
            expect(error).toBeDefined();
        });
    });
    it('should return no error if input is valid', () => {
        const input = generateValidInput();
        const { error } = schemas_1.createUserSchema.validate(input);
        expect(error).toBeUndefined();
    });
});
