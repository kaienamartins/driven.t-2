import Joi from 'joi';
import { Payment, TicketId } from '@/protocols';

export const paymentSchema = Joi.object<Payment>({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.number().required(),
  }).required(),
});

export const ticketSchema = Joi.object<TicketId>({
  ticketId: Joi.number().required(),
});
