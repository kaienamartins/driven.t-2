import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares/authentication-middleware';
import { Payment } from '@/protocols';
import paymentsService from '@/services/payment-service';

export async function getPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticketId } = req.query;
  const userId = req.userId as number;

  if (!req.session) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  if (!ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const result = await paymentsService.getPayment(Number(ticketId), userId);

    if (!result) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if (result.ticketId !== userId) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    res.status(httpStatus.OK).send(result);
  } catch (err) {
    next(err);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const paymentsInfo = req.body as Payment;
  const userId = req.userId as number;

  if (!req.session) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  if (!paymentsInfo.cardData || !paymentsInfo.ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const result = await paymentsService.postPayment(paymentsInfo, userId);

    if (!result) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if (result.id !== userId) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    res.status(httpStatus.OK).send(result);
  } catch (err) {
    next(err);
  }
}
