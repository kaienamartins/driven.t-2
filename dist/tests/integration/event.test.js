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
const http_status_1 = __importDefault(require("http-status"));
const supertest_1 = __importDefault(require("supertest"));
const factories_1 = require("../factories");
const helpers_1 = require("../helpers");
const app_1 = __importStar(require("@/app"));
beforeAll(async () => {
    await app_1.init();
    await helpers_1.cleanDb();
});
const server = supertest_1.default(app_1.default);
describe('GET /event', () => {
    it('should respond with status 404 if there is no event', async () => {
        const response = await server.get('/event');
        expect(response.status).toBe(http_status_1.default.NOT_FOUND);
    });
    it('should respond with status 200 and event data if there is an event', async () => {
        const event = await factories_1.createEvent();
        const response = await server.get('/event');
        expect(response.status).toBe(http_status_1.default.OK);
        expect(response.body).toEqual({
            id: event.id,
            title: event.title,
            backgroundImageUrl: event.backgroundImageUrl,
            logoImageUrl: event.logoImageUrl,
            startsAt: event.startsAt.toISOString(),
            endsAt: event.endsAt.toISOString(),
        });
    });
});
