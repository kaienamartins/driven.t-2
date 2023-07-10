import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import serviceTickets from '@/services/tickets-service';

export async function postTicket(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const { ticketTypeId } = req.body;
  const userId = req.userId as number;

  if (!req.session) {
    return res.status(httpStatus.UNAUTHORIZED).send();
  }

  try {
    const result = await serviceTickets.createTicket(ticketTypeId, userId);

    if (!ticketTypeId) {
      return res.status(httpStatus.BAD_REQUEST).send();
    }

    if (!result) {
      return res.status(httpStatus.NOT_FOUND).send();
    }

    return res.status(httpStatus.CREATED).send(result);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
  }
}

export async function getTicket(_req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const session = _req.session;

    if (!session) {
      return res.status(httpStatus.UNAUTHORIZED).send();
    }

    const tickets = await serviceTickets.getTicketType();

    return res.status(httpStatus.OK).send(tickets);
  } catch (err) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const { userId } = req;
  try {
    const session = req.session;

    if (!session) {
      return res.status(httpStatus.UNAUTHORIZED).send();
    }

    const result = await serviceTickets.getUser(userId);

    if (!result) {
      return res.status(httpStatus.NOT_FOUND).send();
    }

    return res.status(httpStatus.OK).send(result);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
  }
}

const ticketsController = {
  postTicket,
  getTicket,
  getUser,
};

export default ticketsController;
