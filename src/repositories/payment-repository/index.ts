import { prisma } from '@/config';
import { Payment } from '@/protocols';

async function postPayment(paymentInfo: Payment, value: number) {
  return prisma.payment.create({
    data: {
      ticketId: paymentInfo.ticketId,
      value: value,
      cardIssuer: paymentInfo.cardData.issuer,
      cardLastDigits: paymentInfo.cardData.number.toString().slice(-4),
    },
  });
}

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

const paymentRepository = {
  postPayment,
  getPayment,
};

export default paymentRepository;
