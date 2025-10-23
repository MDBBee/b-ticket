import { Orderstatus } from '@b-tickets/common';
import mongoose from 'mongoose';

// For Type hinting while creating a ticket
interface PaymentAttributes {
  orderId: string;
  stripeId: string;
}

// A single output doc for the model doc/instance
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

// The model and all it's properties
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  createPayment(inputs: PaymentAttributes): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    stripeId: { type: String, required: true },
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

paymentSchema.statics.createPayment = (inputs: PaymentAttributes) =>
  new Payment(inputs);

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
