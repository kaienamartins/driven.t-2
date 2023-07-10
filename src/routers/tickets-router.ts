import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { postTicket, getTicket, getUser } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getTicket);
ticketsRouter.post('/', authenticateToken, postTicket);
ticketsRouter.get('/', authenticateToken, getUser);

export { ticketsRouter };
