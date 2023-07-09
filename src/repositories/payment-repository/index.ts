import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function postPayment(ticketId: number, paymentInfo: PaymentType) {
  return prisma.payment.create({
    data: {
      ticketId,
      ...paymentInfo,
    },
  });
}

export type PaymentType = Omit<Payment, 'id' | 'updatedAt' | 'createdAt'>;

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

const paymentRepositories = {
  postPayment,
  getPayment,
};

export default paymentRepositories;
