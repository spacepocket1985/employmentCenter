import { Schema, model } from 'mongoose';

export interface User {
  name: string;
  password: string;
}

const userSchema = new Schema<User>({
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

export const User = model<User>('User', userSchema);
