import { Router } from 'express';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { postPayment, getPayment } from '@/controllers';
import { paymentSchema, ticketSchema } from '@/schemas/payment-schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', validateQuery(ticketSchema), getPayment)
  .post('/process', validateBody(paymentSchema), postPayment);

export { paymentsRouter };
