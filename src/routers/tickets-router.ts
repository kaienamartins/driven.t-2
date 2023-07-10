import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketType, getTicket, postTicket } from '@/controllers/tickets-controller';
import { ticketTypeSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketType)
  .get('/', getTicket)
  .post('/', validateBody(ticketTypeSchema), postTicket);

export { ticketsRouter };
