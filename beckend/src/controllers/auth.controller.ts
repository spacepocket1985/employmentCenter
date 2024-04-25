import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User, UserType, UserWithToken } from "../models/user.model";
import keys from "../config/keys";
import { RequestWithBody } from "../types/types";
import { UserCreateModel } from "../models/userCreateModel";
import { UserViewModel } from "../models/userViewModel";
import { UserQueryModel } from "../models/userQueryModel";


class AuthController {
  register = async (req: RequestWithBody<UserCreateModel>, res: Response<UserViewModel<UserType>>) => {
    const { name, password } = req.body;

    if (!name || !password) {
      throw new Error("Name and password must be provided.");
    }

    const candidate = await User.findOne({ name });
    if (candidate) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ msg: `User with this name (${name}) is already registered.` });
    } else {
      const hashedPassword = await hash(password, 10);
      const newUser = await User.create({
        name,
        password: hashedPassword,
      });

      res
        .status(StatusCodes.CREATED)
        .json({ data: newUser, msg: "New user has been created!" });
    }
  };

  login = async (req: RequestWithBody<UserQueryModel>, res: Response<UserViewModel<UserWithToken>>) => {
    const { name, password } = req.body;

    const candidate = await User.findOne({ name });

    if (candidate) {
      const passwordResult = await compare(password, candidate.password);
      if (passwordResult) {
        //token generate, passwords matched

        const token = sign(
          {
            name: candidate.name,
            userId: candidate._id,
          },
          keys.jwt,
          { expiresIn: 60 * 60 }
        );

        res.status(StatusCodes.OK).json({
          data: { token: `Bearer ${token}`, name },
          msg: "Sucsess login",
        });
      } else {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ msg: "Пароль не верен. Попробуйте еще раз!" });
      }
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `Пользователь с именем (${name}) не найден!` });
    }
  };
}

export const userAuthController = new AuthController();
