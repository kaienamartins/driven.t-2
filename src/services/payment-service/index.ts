import { unauthorizedError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import paymentsRepositories, { PaymentType } from '@/repositories/payment-repository';

async function createPayment(ticketId: number, cardData: PaymentType) {
  const ticketType = await ticketsRepository.getUsersTicketWithType(ticketId);

  const paymentInfo = {
    ticketId,
    value: ticketType.TicketType.price,
    cardIssuer: cardData.cardIssuer,
    cardLastDigits: cardData.cardLastDigits.slice(-4),
  };

  const payment = await paymentsRepositories.postPayment(ticketId, paymentInfo);

  await ticketsRepository.ticketsPayment(ticketId);

  return payment;
}

async function getPaymentFromTicketId(ticketId: number) {
  const payments = await paymentsRepositories.getPayment(ticketId);

  if (!payments) throw unauthorizedError();

  return payments;
}

const paymentService = {
  createPayment,
  getPaymentFromTicketId,
};

export default paymentService;
