import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import serviceTickets from '@/services/tickets-service';

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  const userId = req.userId as number;
  if (!ticketTypeId) res.status(httpStatus.BAD_REQUEST).send({ message: 'Bad Request' });
  try {
    const result = await serviceTickets.createTicket(ticketTypeId, userId);
    res.status(httpStatus.CREATED).send(result);
  } catch (err) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getTicket(_req: AuthenticatedRequest, res: Response) {
  try {
    const tickets = await serviceTickets.getTicketType();
    res.status(httpStatus.OK).send(tickets);
  } catch (err) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const result = await serviceTickets.getUser(userId);
    res.status(httpStatus.OK).send(result);
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
