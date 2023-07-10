import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getPayment, postPayment } from '@/controllers/payment-controller';

const paymentRouter = Router();

paymentRouter.get('/', authenticateToken, getPayment);
paymentRouter.post('/process', authenticateToken, postPayment);

export { paymentRouter };
