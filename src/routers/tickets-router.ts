import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketType, getTickets, postTickets } from '@/controllers/tickets-controller';
import { ticketTypeSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketType)
  .get('/', getTickets)
  .post('/', validateBody(ticketTypeSchema), postTickets);

export { ticketsRouter };
