import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// For Type hinting while creating a ticket
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

// A single output doc for the model doc/instance
interface TicketDocs extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

// The model and all it's properties
interface TicketModel extends mongoose.Model<TicketDocs> {
  createTicket(inputs: TicketAttributes): TicketDocs;
}

// Schema
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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

// Static method
ticketSchema.statics.createTicket = (inputs: TicketAttributes) => {
  return new Ticket(inputs);
};

//  The model itself
const Ticket = mongoose.model<TicketDocs, TicketModel>('Ticket', ticketSchema);

export { Ticket };
