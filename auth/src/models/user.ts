import mongoose from 'mongoose';

interface UserAttributes {
  email: string;
  password: string;
}

// Describes the properties of a User Model
interface UserModel extends mongoose.Model<UserDoc> {
  createUser(inputs: UserAttributes): UserDoc;
}

// Describes the properties of a User Document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
