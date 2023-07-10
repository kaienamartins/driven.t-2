import httpStatus from 'http-status';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getTicketsTypes() {
  const result = await ticketsRepository.getTicketType();
  return result;
}

async function getTicketsTypeById(ticketTypeId: number) {
  const result = await ticketsRepository.getTicketTypeById(ticketTypeId);
  return result;
}

async function getTickets(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw { type: 'application', error: httpStatus.NOT_FOUND, message: 'Enrollment not found' };

  const tickets = await ticketsRepository.getTickets(enrollment.id);
  if (!tickets) throw { type: 'application', error: httpStatus.NOT_FOUND, message: 'user doesnt have any ticket' };

  return tickets;
}

async function getAllTickets(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw { type: 'application', error: httpStatus.UNAUTHORIZED, message: 'user doesnt own ticket' };

  const tickets = await ticketsRepository.getTickets(enrollment.id);
  if (!tickets) throw { type: 'application', error: httpStatus.UNAUTHORIZED, message: 'user doesnt own ticket' };

  return tickets;
}

async function postTickets(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw { type: 'application', error: httpStatus.NOT_FOUND };

  const type = await getTicketsTypeById(ticketTypeId);
  if (!type) throw { type: 'application', error: httpStatus.NOT_FOUND };

  const ticket = await ticketsRepository.postTicket(enrollment.id, ticketTypeId);

  return ticket;
}

async function getTicketById(ticketId: number) {
  const ticket = await ticketsRepository.getTicketById(ticketId);
  console.log(ticket);
  if (!ticket) throw { type: 'application', error: httpStatus.NOT_FOUND, message: 'ticket doesnt exist' };

  return ticket;
}

const ticketsServices = {
  getTicketsTypes,
  getTickets,
  postTickets,
  getTicketById,
  getAllTickets,
};

export default ticketsServices;
