import { Address } from '@prisma/client';
import { prisma } from '@/config';

async function upsert(enrollmentId: number, createdAddress: CreateAddressParams, updatedAddress: UpdateAddressParams) {
  return prisma.address.upsert({
    where: {
      enrollmentId,
    },
    create: {
      Enrollment: { connect: { id: enrollmentId } },
      number: createdAddress.number,
      cep: createdAddress.cep,
      street: createdAddress.street,
      city: createdAddress.city,
      state: createdAddress.state,
      neighborhood: createdAddress.neighborhood,
      addressDetail: createdAddress.addressDetail,
      updatedAt: new Date(),
    },
    update: updatedAddress,
  });
}

export type CreateAddressParams = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentId'>;
export type UpdateAddressParams = CreateAddressParams;

const addressRepository = {
  upsert,
};

export default addressRepository;
