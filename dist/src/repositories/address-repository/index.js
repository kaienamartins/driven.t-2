"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@/config");
async function upsert(enrollmentId, createdAddress, updatedAddress) {
    return config_1.prisma.address.upsert({
        where: {
            enrollmentId,
        },
        create: {
            ...createdAddress,
            Enrollment: { connect: { id: enrollmentId } },
        },
        update: updatedAddress,
    });
}
const addressRepository = {
    upsert,
};
exports.default = addressRepository;
