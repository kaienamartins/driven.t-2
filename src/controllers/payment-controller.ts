import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares/authentication-middleware';
import paymentsService from '@/services/payment-service';
import { Payment } from '@/protocol';

export async function getPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticketId } = req.query;
  const userId = req.userId as number;
  if (!ticketId) res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const result = await paymentsService.getPayment(Number(ticketId), userId);
    res.status(httpStatus.OK).send(result);
  } catch (err) {
    next(err);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const paymentsInfo = req.body as Payment;
  const userId = req.userId as number;
  try {
    if (!paymentsInfo.cardData || !paymentsInfo.ticketId) res.sendStatus(httpStatus.BAD_REQUEST);

    const result = await paymentsService.postPayment(paymentsInfo, userId);

    res.status(httpStatus.OK).send(result);
  } catch (err) {
    next(err);
  }
}

const paymentsController = {
  getPayment,
  postPayment,
};

export default paymentsController;
