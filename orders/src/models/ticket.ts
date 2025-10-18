import mongoose from 'mongoose';
import { Order } from './order';
import { Orderstatus } from '@b-tickets/common';

// Typing assistance/hinting when creating a doc
interface TicketAttributes {
  title: string;
  price: number;
  id: string;
}

// Typing for a doc to be created
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

// Typing for the entire model
interface TicketModel extends mongoose.Model<TicketDoc> {
  createTicket(input: TicketAttributes): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret: { [key: string]: any }) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.createTicket = (inputs: TicketAttributes) => {
  return new Ticket({
    _id: inputs.id,
    title: inputs.title,
    price: inputs.price,
  });
};

ticketSchema.methods.isReserved = async function () {
  // Ticket reserved?:>query orders where ticketId=ticket.id&&>order.staus!=="cancelled">
  const existingOrder = await Order.findOne({
    ticket: this, //this-> the instance of Ticket
    status: {
      $in: [
        Orderstatus.AwaitingPayment,
        Orderstatus.Complete,
        Orderstatus.Created,
      ],
    },
  });

  return existingOrder !== null;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
