import { Ticket, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function createTicket(ticket: CreateTicketType) {
  return prisma.ticket.create({
    data: {
      ...ticket,
    },
  });
}

async function getTicketsByEnrollementID(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function getTicketsType() {
  return prisma.ticketType.findMany();
}

async function getUsersTicketWithType(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function ticketsPayment(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

export type CreateTicketType = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

const repTickets = {
  createTicket,
  getTicketsByEnrollementID,
  getTicketsType,
  getUsersTicketWithType,
  ticketsPayment,
};

export default repTickets;
