import { Enrollment } from '@prisma/client';
import { prisma } from '../../config';

async function getTicketType() {
  return await prisma.ticketType.findMany();
}

async function getTicketTypeById(ticketTypeId: number) {
  return await prisma.ticketType.findFirst({
    where: { id: ticketTypeId },
  });
}

async function user(userId: number) {
  return await prisma.ticket.findFirst({
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: {
        select: {
          id: true,
          name: true,
          price: true,
          isRemote: true,
          includesHotel: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    where: {
      Enrollment: {
        userId: userId,
      },
    },
  });
}

async function getUser(userId: number) {
  return await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
}

async function checkEnrollment(userId: number): Promise<Enrollment> {
  return await prisma.enrollment.findFirst({
    where: {
      userId,
    },
  });
}

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  return await prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
  });
}

async function getTicketById(ticketId: string | number) {
  return await prisma.ticket.findFirst({
    where: { id: Number(ticketId) },
  });
}

async function updateTicket(ticketId: number) {
  return await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });
}

const repTickets = {
  getTicketType,
  user,
  getUser,
  checkEnrollment,
  createTicket,
  getTicketById,
  getTicketTypeById,
  updateTicket,
};

export default repTickets;
