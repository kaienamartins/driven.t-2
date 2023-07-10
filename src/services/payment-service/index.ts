import httpStatus from 'http-status';
import { Payment } from '@/protocols';
import ticketsServices from '@/services/tickets-service';
import paymentRepository from '@/repositories/payment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function checkTicket(userId: number, ticketId: number) {
  await ticketsServices.getTicketById(ticketId);

  const ticket = await ticketsServices.getAllTickets(userId);

  if (ticket.id !== ticketId) {
    return { error: 'user doesnt own ticket' };
  }

  return ticket.TicketType.price;
}

async function postPayment(userId: number, paymentInfo: Payment) {
  console.log(paymentInfo);
  const price = await checkTicket(userId, paymentInfo.ticketId);

  if (typeof price === 'number') {
    await ticketsRepository.paid(paymentInfo.ticketId);

    const payment = await paymentRepository.postPayment(paymentInfo, price);

    return payment;
  } else {
    console.log(price.error);
  }
}

async function getPayment(userId: number, ticketId: number) {
  await checkTicket(userId, ticketId);

  const payment = await paymentRepository.getPayment(ticketId);
  if (!payment) {
    return { error: httpStatus.NOT_FOUND };
  }
  return payment;
}

const paymentServices = {
  postPayment,
  getPayment,
};

export default paymentServices;
