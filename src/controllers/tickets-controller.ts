import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import serviceTickets from '@/services/tickets-service';

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const ticket = await serviceTickets.getUser(userId);
    return res.status(httpStatus.OK).send(ticket);
  } catch (err) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getTicketsType(res: Response) {
  try {
    const ticketType = await serviceTickets.getTicket();
    return res.status(httpStatus.OK).send(ticketType);
  } catch (err) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { typeId } = req.body;

  try {
    if (!typeId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    const ticket = await serviceTickets.createUser(userId, typeId);
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (err) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
