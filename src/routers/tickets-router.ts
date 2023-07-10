import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { postTicket, getTicket, getUser } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.post('/', authenticateToken, postTicket);
ticketsRouter.get('/types', authenticateToken, getTicket);
ticketsRouter.get('/', authenticateToken, getUser);

export { ticketsRouter };
