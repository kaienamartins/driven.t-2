"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultEvent = void 0;
const http_status_1 = __importDefault(require("http-status"));
const events_service_1 = __importDefault(require("@/services/events-service"));
async function getDefaultEvent(_req, res) {
    try {
        const event = await events_service_1.default.getFirstEvent();
        return res.status(http_status_1.default.OK).send(event);
    }
    catch (error) {
        return res.status(http_status_1.default.NOT_FOUND).send({});
    }
}
exports.getDefaultEvent = getDefaultEvent;
