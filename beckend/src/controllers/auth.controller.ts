import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../models/user.model";
import keys from "../config/keys";

class AuthController {
  register = async (req: Request, res: Response) => {
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

      console.log("new User ", newUser);

      res
        .status(StatusCodes.CREATED)
        .json({ user: newUser, msg: "New user has been created!" });
    }
  };

  login = async (req: Request, res: Response) => {
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
          .json({ message: "Пароль не верен. Попробуйте еще раз!" });
      }
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Пользователь с именем (${name}) не найден!` });
    }
  };
}

export const userAuthController = new AuthController();
