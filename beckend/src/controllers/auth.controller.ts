// Controller Layer (Presentation Layer):
// Description: Processes requests and interacts with the service to manage user authentication.

import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestWithBody} from '../types/types';
import { UserCreateModel } from '../models/userCreateModel';
import { UserQueryModel } from '../models/userQueryModel';
import { UserViewModel } from '../models/userViewModel';
import { UserType, UserWithToken } from '../models/user.model';
import { userService } from '../services/user.service';
import { jwtService } from '../services/jwt.service';

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
      const user = await userService.checkCredentials(name, password);

      const token = await jwtService.createJWT(user);
      res.status(StatusCodes.OK).json({ data: token, msg: 'Success login' });
    } catch (error) {
      if (error instanceof Error)
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: error.message });
    }
  };
  findUser = async (
    req: Request,
    res: Response<UserViewModel<string>>
  ) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (token) {
      const userId = await jwtService.getUserIdByToken(token);
      console.log('userId', userId)
      if (userId) {
        const userData = await userService.findUserById(userId);
        res
          .status(StatusCodes.OK)
          .json({ data: userData, msg: 'We have a user' });
      }
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'Unauthorized' });
    }
  };
}

export const userAuthController = new AuthController();
