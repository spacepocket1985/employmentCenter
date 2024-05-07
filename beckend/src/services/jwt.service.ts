import { sign, verify } from 'jsonwebtoken';
import { UserTypeForToken } from '../models/user.model';
import keys from '../config/keys';
import { ObjectId } from 'mongodb';

export const jwtService = {
  async createJWT(user: UserTypeForToken) {
    const token = sign(
      {
        name: user.name,
        userId: user.id,
      },
      keys.jwt,
      { expiresIn: 60 * 60 }
    );

    return { token: `Bearer ${token}`, name: user.name };
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = verify(token, keys.jwt);
      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    }
  },
};
