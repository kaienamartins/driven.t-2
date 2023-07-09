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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateValidToken = exports.cleanDb = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const factories_1 = require("./factories");
const sessions_factory_1 = require("./factories/sessions-factory");
const config_1 = require("@/config");
async function cleanDb() {
    await config_1.prisma.address.deleteMany({});
    await config_1.prisma.payment.deleteMany({});
    await config_1.prisma.ticket.deleteMany({});
    await config_1.prisma.enrollment.deleteMany({});
    await config_1.prisma.event.deleteMany({});
    await config_1.prisma.session.deleteMany({});
    await config_1.prisma.user.deleteMany({});
    await config_1.prisma.ticketType.deleteMany({});
}
exports.cleanDb = cleanDb;
async function generateValidToken(user) {
    const incomingUser = user || (await factories_1.createUser());
    const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);
    await sessions_factory_1.createSession(token);
    return token;
}
exports.generateValidToken = generateValidToken;
