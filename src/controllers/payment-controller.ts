import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payment-service';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const ticketId = Number(req.query.ticketId);

  try {
    if (!req.userId) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    if (!ticketId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const newPayment = await paymentsService.getPaymentFromTicketId(ticketId);

    if (!newPayment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if (newPayment.userId && newPayment.userId !== req.userId) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    if ('userId' in newPayment && newPayment.userId !== req.userId) {
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
    if (!ticketId || !cardData) {
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

    return res.status(httpStatus.OK).send(newPayment);
  } catch (err) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
