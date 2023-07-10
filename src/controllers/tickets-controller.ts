import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import serviceTickets from '@/services/tickets-service';

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  const userId = req.userId as number;

  if (!req.session) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  try {
    const result = await serviceTickets.createTicket(ticketTypeId, userId);

    if (!ticketTypeId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    if (!result) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.CREATED).send(result);
  } catch (err) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getTicket(_req: AuthenticatedRequest, res: Response) {
  try {
    const session = _req.session;

    if (!session) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const tickets = await serviceTickets.getTicketType();

    return res.status(httpStatus.OK).send(tickets);
  } catch (err) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const session = req.session;

    if (!session) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const result = await serviceTickets.getUser(userId);

    if (!result) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.OK).send(result);
  } catch (err) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

const ticketsController = {
  postTicket,
  getTicket,
  getUser,
};

export default ticketsController;
