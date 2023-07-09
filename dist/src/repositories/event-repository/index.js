"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@/config");
async function findFirst() {
    return config_1.prisma.event.findFirst();
}
const eventRepository = {
    findFirst,
};
exports.default = eventRepository;
