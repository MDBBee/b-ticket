import mongoose from 'mongoose';
import { Orderstatus } from '@b-tickets/common';
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Typing assistance/hinting when creating a doc
interface OrderAttributes {
  userId: string;
  status: Orderstatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// Ts for a single doc obj from the model
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: Orderstatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

// Ts for the entire model
interface OrderModel extends mongoose.Model<OrderDoc> {
  createOrder(input: OrderAttributes): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(Orderstatus),
      default: Orderstatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
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
orderSchema.set('versionKey', 'version');
// Plugin for implementing versioning in mongoose
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.createOrder = (inputs: OrderAttributes) => {
  return new Order(inputs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
