import { TicketStatus } from '@prisma/client';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import repTickets from '@/repositories/tickets-repository';

async function createUser(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };
  await repTickets.createTicket(ticket);

  const NewTicket = await repTickets.getTicketsByEnrollementID(enrollment.id);

  return NewTicket;
}

async function getUser(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = await repTickets.getTicketsByEnrollementID(enrollment.id);

  if (!ticket) throw notFoundError();

  return ticket;
}

async function getTicket() {
  const ticketType = await repTickets.getTicketsType();
  if (!ticketType) throw notFoundError();
  return ticketType;
}

const serviceTickets = {
  createUser,
  getUser,
  getTicket,
};

export default serviceTickets;
