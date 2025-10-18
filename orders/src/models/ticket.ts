import mongoose from 'mongoose';
import { Order } from './order';
import { Orderstatus } from '@b-tickets/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Typing assistance/hinting when creating a doc
interface TicketAttributes {
  title: string;
  price: number;
  id: string;
}

// Typing for a single doc/instance
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

// Typing for the entire model
interface TicketModel extends mongoose.Model<TicketDoc> {
  createTicket(input: TicketAttributes): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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

// Resetting '__v' key name for output doc
ticketSchema.set('versionKey', 'version');
// Plugin for implementing versioning in mongoose
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.createTicket = (inputs: TicketAttributes) => {
  return new Ticket({
    _id: inputs.id,
    title: inputs.title,
    price: inputs.price,
  });
};

ticketSchema.statics.findByEvent = async (event) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
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
