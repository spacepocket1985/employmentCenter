// Service level (Business Logic Layer):
// Description: Implements the logic for working with auth user.

import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { User } from '../models/user.model';
import keys from '../config/keys';

class UserService {
  async registerUser(name: string, password: string) {
    const candidate = await User.findOne({ name });
    if (candidate) {
      throw new Error(`User with this name (${name}) is already registered.`);
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await User.create({
      name,
      password: hashedPassword,
    });

    return newUser;
  }

  async loginUser(name: string, password: string) {
    const candidate = await User.findOne({ name });

    if (!candidate) {
      throw new Error(`User with name (${name}) not found.`);
    }

    const passwordResult = await compare(password, candidate.password);
    if (!passwordResult) {
      throw new Error('Incorrect password. Please try again.');
    }

    const token = sign(
      {
        name: candidate.name,
        userId: candidate._id,
      },
      keys.jwt,
      { expiresIn: 60 * 60 }
    );

    return { token: `Bearer ${token}`, name: candidate.name };
  }
}

export const userService = new UserService();
