import { Orderstatus } from '@b-tickets/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// For Type hinting while creating a ticket
interface OrderAttributes {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: Orderstatus;
}

// A single output doc for the model doc/instance
interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: Orderstatus;
}

// The model and all it's properties
interface OrderModel extends mongoose.Model<OrderDoc> {
  createOrder(inputs: OrderAttributes): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.createOrder = (inputs: OrderAttributes) => {
  return new Order({
    _id: inputs.id,
    version: inputs.version,
    price: inputs.price,
    userId: inputs.userId,
    status: inputs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
