import mongoose from 'mongoose';
import { Password } from '../utils/password';

interface UserAttributes {
  email: string;
  password: string;
}

// Describes the properties and methods of a User Model
interface UserModel extends mongoose.Model<UserDoc> {
  buildUser(inputs: UserAttributes): UserDoc;
}

// Describes the properties of a User Document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret: { [key: string]: any }) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }

  done();
});

userSchema.statics.buildUser = (inputs: UserAttributes) => {
  return new User(inputs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
