import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentServices from '@/services/payment-service';
import { TicketId } from '@/protocols';

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const payment = await paymentServices.postPayment(userId, req.body);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const { ticketId } = req.query as TicketId;

  try {
    const payment = await paymentServices.getPayment(userId, parseInt(ticketId));
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
