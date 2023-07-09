import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTickets, postTickets, getTicketTypes } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getTicketTypes).post('/', postTickets).get('/', getTickets);

export { ticketsRouter };
