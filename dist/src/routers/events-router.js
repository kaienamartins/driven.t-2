"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("@/controllers");
const eventsRouter = express_1.Router();
exports.eventsRouter = eventsRouter;
eventsRouter.get('/', controllers_1.getDefaultEvent);
