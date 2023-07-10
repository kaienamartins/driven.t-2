import { Enrollment } from '@prisma/client';
import { prisma } from '../../config';
import { notFoundError } from '@/errors';

async function getTicketType() {
  const ticketTypes = await prisma.ticketType.findMany();
  return ticketTypes;
}

async function getTicketTypeById(ticketTypeId: number) {
  const ticketType = await prisma.ticketType.findFirst({
    where: { id: ticketTypeId },
  });
  return ticketType;
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
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      Enrollment: true,
    },
  });
  return user;
}

async function checkEnrollment(userId: number): Promise<Enrollment | null> {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
    },
  });
  return enrollment;
}

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  const checkEnrollmentResult = await checkEnrollment(enrollmentId);

  if (!checkEnrollmentResult) {
    throw notFoundError();
  }

  const ticket = await prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
  });

  return ticket;
}

async function getTicketById(ticketId: string | number) {
  const ticket = await prisma.ticket.findFirst({
    where: { id: Number(ticketId) },
  });
  return ticket;
}

async function updateTicket(ticketId: number) {
  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });
  return updatedTicket;
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
