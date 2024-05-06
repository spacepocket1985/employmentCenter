// Controller Layer (Presentation Layer):
// Description: Processes requests and interacts with the service to manage user authentication.

import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestWithBody } from '../types/types';
import { UserCreateModel } from '../models/userCreateModel';
import { UserQueryModel } from '../models/userQueryModel';
import { UserViewModel } from '../models/userViewModel';
import { UserType, UserWithToken } from '../models/user.model';
import { userService } from '../services/user.service';

class AuthController {
  register = async (
    req: RequestWithBody<UserCreateModel>,
    res: Response<UserViewModel<UserType>>
  ) => {
    const { name, password } = req.body;

    try {
      const newUser = await userService.registerUser(name, password);
      res
        .status(StatusCodes.CREATED)
        .json({ data: newUser, msg: 'New user has been created!' });
    } catch (error) {
      if (error instanceof Error)
        res.status(StatusCodes.CONFLICT).json({ msg: error.message });
    }
  };

  login = async (
    req: RequestWithBody<UserQueryModel>,
    res: Response<UserViewModel<UserWithToken>>
  ) => {
    const { name, password } = req.body;

    try {
      const userWithToken = await userService.loginUser(name, password);
      res
        .status(StatusCodes.OK)
        .json({ data: userWithToken, msg: 'Success login' });
    } catch (error) {
      if (error instanceof Error)
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: error.message });
    }
  };
}

export const userAuthController = new AuthController();
