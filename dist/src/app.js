"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.init = void 0;
require("reflect-metadata");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("@/config");
config_1.loadEnv();
const middlewares_1 = require("@/middlewares");
const routers_1 = require("@/routers");
const app = express_1.default();
app
    .use(cors_1.default())
    .use(express_1.default.json())
    .get('/health', (_req, res) => res.send('OK!'))
    .use('/users', routers_1.usersRouter)
    .use('/auth', routers_1.authenticationRouter)
    .use('/event', routers_1.eventsRouter)
    .use('/enrollments', routers_1.enrollmentsRouter)
    .use(middlewares_1.handleApplicationErrors);
function init() {
    config_1.connectDb();
    return Promise.resolve(app);
}
exports.init = init;
async function close() {
    await config_1.disconnectDB();
}
exports.close = close;
exports.default = app;
