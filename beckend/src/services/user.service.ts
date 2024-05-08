// Service level (Business Logic Layer):
// Description: Implements the logic for working with auth user.

import { hash, compare } from 'bcryptjs'
import { User, UserTypeForToken } from '../models/user.model';
import { jwtService } from './jwt.service';


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

    const token = jwtService.createJWT({
      name: candidate.name,
      password: candidate.password,
      id: candidate._id
    })

    return token;
  }
  async checkCredentials(name: string, password: string) {
    const candidate = await User.findOne({ name });

    if (!candidate) {
      throw new Error(`User with name (${name}) not found.`);
    }

    const passwordResult = await compare(password, candidate.password);
    if (!passwordResult) {
      throw new Error('Incorrect password. Please try again.');
    }

    const verifiedUser: UserTypeForToken = {
      name,
      password,
      id: candidate._id,
    };

    return verifiedUser;
  }

  async findUserById(_id: any) {
    const candidate = await User.findOne({ _id });
    if (!candidate) {
      throw new Error(`User with id (${_id}) not found.`);
    }
    return  candidate.name ;
  }
}

export const userService = new UserService();
