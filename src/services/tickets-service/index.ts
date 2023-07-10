import { notFoundError } from '@/errors';
import repTickets from '@/repositories/tickets-repository';

async function getTicketType() {
  const res = await repTickets.getTicketType();
  if (!res) throw notFoundError();
  return res;
}

async function getUser(userId: number) {
  const res = await repTickets.getUser(userId);
  if (!res) throw notFoundError();
  return res;
}

async function createTicket(ticketTypeId: number, userId: number) {
  const checkEnrollment = await repTickets.checkEnrollment(userId);

  if (!checkEnrollment) throw notFoundError();

  return await repTickets.createTicket(ticketTypeId, checkEnrollment.id);
}

const serviceTickets = {
  getTicketType,
  getUser,
  createTicket,
};

export default serviceTickets;
