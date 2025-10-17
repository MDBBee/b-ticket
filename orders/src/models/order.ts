import mongoose from 'mongoose';

// Typing assistance/hinting when creating a doc
interface OrderAttributes {
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDoc;
}

// typing for a doc to be created
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDoc;
}

// Typing for the entire model
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

orderSchema.statics.createOrder = (inputs: OrderAttributes) => {
  return new Order(inputs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
