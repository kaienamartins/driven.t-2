"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const events_service_1 = __importDefault(require("../events-service"));
const errors_1 = require("./errors");
const user_repository_1 = __importDefault(require("@/repositories/user-repository"));
const errors_2 = require("@/errors");
async function createUser({ email, password }) {
    await canEnrollOrFail();
    await validateUniqueEmailOrFail(email);
    const hashedPassword = await bcrypt_1.default.hash(password, 12);
    return user_repository_1.default.create({
        email,
        password: hashedPassword,
    });
}
exports.createUser = createUser;
async function validateUniqueEmailOrFail(email) {
    const userWithSameEmail = await user_repository_1.default.findByEmail(email);
    if (userWithSameEmail) {
        throw errors_1.duplicatedEmailError();
    }
}
async function canEnrollOrFail() {
    const canEnroll = await events_service_1.default.isCurrentEventActive();
    if (!canEnroll) {
        throw errors_2.cannotEnrollBeforeStartDateError();
    }
}
const userService = {
    createUser,
};
__exportStar(require("./errors"), exports);
exports.default = userService;
