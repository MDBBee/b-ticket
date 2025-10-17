import mongoose from 'mongoose';

// Typing assistance/hinting when creating a doc
interface TicketAttributes {
  title: string;
  price: number;
}

// typing for a doc to be created
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
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
  return new Ticket(inputs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
