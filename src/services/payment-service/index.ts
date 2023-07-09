import { unauthorizedError } from '@/errors';
import repTickets from '@/repositories/tickets-repository';
import paymentsRepositories, { PaymentType } from '@/repositories/payment-repository';

async function createPayment(ticketId: number, cardData: PaymentType) {
  const ticketType = await repTickets.getUsersTicketWithType(ticketId);

  const paymentInfo = {
    ticketId,
    value: ticketType.TicketType.price,
    cardIssuer: cardData.cardIssuer,
    cardLastDigits: cardData.cardLastDigits.slice(-4),
  };

  const payment = await paymentsRepositories.postPayment(ticketId, paymentInfo);

  await repTickets.ticketsPayment(ticketId);

  return payment;
}

async function getPaymentFromTicketId(ticketId: number) {
  const payment = await paymentsRepositories.getPayment(ticketId);

  if (!payment) throw unauthorizedError();

  return payment;
}

async function checkUserOwnership(userId: number, ticketId: number) {
  const ticket = await repTickets.getUsersTicketWithType(ticketId);

  if (ticket.enrollmentId !== userId) throw unauthorizedError();

  return true;
}

const paymentService = {
  createPayment,
  getPaymentFromTicketId,
  checkUserOwnership,
};

export default paymentService;
