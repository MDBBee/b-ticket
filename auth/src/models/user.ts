import mongoose from 'mongoose';
import { Password } from '../utils/password';

interface UserAttributes {
  email: string;
  password: string;
}

// Fuction:-> UserModel Describes the properties and methods of the entire User-Model for typing purposes.
// Objective:-> To get type safety(or integrating typescript) when creating a new object/Document from the model/schema.
// Description:-> Takes the props of the current moongoose schema and add this static method.
interface UserModel extends mongoose.Model<UserDoc> {
  buildUser(inputs: UserAttributes): UserDoc;
}

// Fuction:-> Describes the properties of a User Document (object types/props after instatiation)
// Description:-> Take the doc of a normal moongoose object and add these ones
// Objective:-> To clearly distiguish between the before and after instatiation(the creation of a new document) properties of this model.
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
