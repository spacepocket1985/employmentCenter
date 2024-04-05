import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { User } from '../models/user.model';

class AuthController {
  register = async (req: Request, res: Response) => {
    const { name, password } = req.body;

    if (!name || !password) {
      throw new Error('Name and password must be provided.');
    }

    const candidate = await User.findOne({ name });
    if (candidate) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ msg: `User with this name (${name}) is already registered.` });
    } else {
      const newUser = await User.create(req.body);

      console.log('new User ', newUser);

      res
        .status(StatusCodes.CREATED)
        .json({ user: newUser, msg: 'New user has been created!' });
    }
  };
}

export const userAuthController = new AuthController();
