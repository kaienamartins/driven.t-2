"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentsRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("@/middlewares");
const controllers_1 = require("@/controllers");
const schemas_1 = require("@/schemas");
const enrollmentsRouter = express_1.Router();
exports.enrollmentsRouter = enrollmentsRouter;
enrollmentsRouter
    .get('/cep', controllers_1.getAddressFromCEP)
    .all('/*', middlewares_1.authenticateToken)
    .get('/', controllers_1.getEnrollmentByUser)
    .post('/', middlewares_1.validateBody(schemas_1.createEnrollmentSchema), controllers_1.postCreateOrUpdateEnrollment);
