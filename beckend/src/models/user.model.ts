import { Schema, model } from 'mongoose';

export type UserType = {
  name: string;
  password: string;
}

export type UserWithToken = {
  name: string;
  token: string;
}

const userSchema = new Schema<UserType>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
});

export const User = model<UserType>('User', userSchema);
