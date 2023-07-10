import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsServices from '@/services/tickets-service';

export async function getTicketType(req: AuthenticatedRequest, res: Response) {
  try {
    const result = await ticketsServices.getTicketType();

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const tickets = await ticketsServices.getTickets(userId);

    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  try {
    const tickets = await ticketsServices.postTickets(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(tickets);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
