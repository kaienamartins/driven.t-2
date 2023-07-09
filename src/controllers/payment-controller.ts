import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payment-service';

const tickets = new Map<number, { status: string }>();

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const ticketId = Number(req.query.ticketId);

  try {
    if (req.userId === undefined) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    if (isNaN(ticketId) || req.query.ticketId === undefined) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const newPayment: unknown = await paymentsService.getPaymentFromTicketId(ticketId);

    if (newPayment === null) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if (typeof newPayment !== 'object' || (newPayment as { userId?: any }).userId !== req.userId) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.status(httpStatus.OK).send(newPayment);
  } catch (err) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId, cardData } = req.body;

  try {
    if (!req.session) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    if (!ticketId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    if (!cardData) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const isUserAuthorized = await paymentsService.checkUserOwnership(req.userId, ticketId);

    if (!isUserAuthorized) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const newPayment = await paymentsService.createPayment(ticketId, cardData);

    if (!newPayment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if (tickets.has(ticketId)) {
      const ticket = tickets.get(ticketId);
      if (ticket) {
        ticket.status = 'PAID';
      }
    }

    return res.status(httpStatus.OK).send(newPayment);
  } catch (err) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
