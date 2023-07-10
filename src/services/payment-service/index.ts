import { notFoundError, unauthorizedError } from '@/errors';
import { Payment } from '@/protocol';

import repTickets from '@/repositories/tickets-repository';
import paymentsRepositories from '@/repositories/payment-repository';

async function getPayment(ticketId: number, userId: number) {
  const ticket = await repTickets.getTicketById(ticketId);

  if (!ticket) throw notFoundError();

  const enrollment = await repTickets.checkEnrollment(userId);

  if (enrollment.id !== ticket.enrollmentId) throw unauthorizedError();

  const payment = await paymentsRepositories.getPayment(ticketId);

  return payment;
}

async function postPayment(paymentsInfo: Payment, userId: number) {
  const ticket = await repTickets.getTicketById(paymentsInfo.ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await repTickets.checkEnrollment(userId);
  if (enrollment.id !== ticket.enrollmentId) throw unauthorizedError();

  const ticketInfo = await repTickets.getTicketTypeById(ticket.ticketTypeId);

  const postPayment = await paymentsRepositories.postPayment(paymentsInfo, ticketInfo.price);

  await repTickets.updateTicket(ticket.id);

  return postPayment;
}

const paymentsService = {
  getPayment,
  postPayment,
};

export default paymentsService;
