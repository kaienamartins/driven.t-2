import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTickets, postTickets, getTicketsType } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getTicketsType).post('/', postTickets).get('/', getTickets);

export { ticketsRouter };
