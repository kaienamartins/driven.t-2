import { prisma } from '../../config';
import { Payment } from '@/protocols';

async function getPayment(ticketId: number) {
  return await prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function postPayment(paymentsInfo: Payment, price: number) {
  return prisma.payment.create({
    data: {
      ticketId: paymentsInfo.ticketId,
      value: price,
      cardIssuer: paymentsInfo.cardData.issuer,
      cardLastDigits: paymentsInfo.cardData.number.toString().substring(11, 16),
    },
  });
}

const paymentsRepositories = {
  getPayment,
  postPayment,
};

export default paymentsRepositories;
