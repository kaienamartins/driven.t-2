import httpStatus from 'http-status';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getTicketType() {
  const result = await ticketsRepository.getTicketType();
  return result;
}

async function getTicketsTypeById(ticketTypeId: number) {
  const result = await ticketsRepository.getTicketTypeById(ticketTypeId);
  return result;
}

async function getTickets(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    return { error: httpStatus.NOT_FOUND };
  }

  const tickets = await ticketsRepository.getTickets(enrollment.id);
  if (!tickets) {
    return { error: httpStatus.NOT_FOUND };
  }

  return tickets;
}

async function getAllTickets(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    return { error: httpStatus.UNAUTHORIZED };
  }

  const tickets = await ticketsRepository.getTickets(enrollment.id);
  if (!tickets) {
    return { error: httpStatus.UNAUTHORIZED };
  }

  return tickets;
}

async function postTickets(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    return { error: httpStatus.NOT_FOUND };
  }

  const type = await getTicketsTypeById(ticketTypeId);
  if (!type) {
    return { error: httpStatus.NOT_FOUND };
  }

  const ticket = await ticketsRepository.postTicket(enrollment.id, ticketTypeId);

  return ticket;
}

async function getTicketById(ticketId: number) {
  const ticket = await ticketsRepository.getTicketById(ticketId);
  console.log(ticket);
  if (!ticket) {
    return { error: httpStatus.NOT_FOUND };
  }

  return ticket;
}

const ticketsServices = {
  getTicketType,
  getTickets,
  postTickets,
  getTicketById,
  getAllTickets,
};

export default ticketsServices;
