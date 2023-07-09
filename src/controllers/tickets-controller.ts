import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import serviceTickets from '@/services/tickets-service';

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    if (!userId) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const hasEnrollment = await serviceTickets.checkUserEnrollment(userId);

    if (!hasEnrollment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const ticket = await serviceTickets.getUser(userId);

    if (!ticket) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.OK).send(ticket);
  } catch (err) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const ticketTypes = await serviceTickets.getTicket();

    if (ticketTypes.length === 0) {
      return res.status(httpStatus.OK).send([]);
    }

    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (err) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  try {
    if (!userId) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    if (!ticketTypeId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const hasEnrollment = await serviceTickets.checkUserEnrollment(userId);

    if (!hasEnrollment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const ticket = await serviceTickets.createUser(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (err) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
