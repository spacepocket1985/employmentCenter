import { sign, verify } from 'jsonwebtoken';
import { UserTypeForToken } from '../models/user.model';
import keys from '../config/keys';

export const jwtService = {
  async createJWT(user: UserTypeForToken) {
    const token = sign(
      {
        name: user.name,
        userId: user.id,
      },
      keys.jwt,
      { expiresIn: '30m' }
    );

    return { token: `Bearer ${token}`, name: user.name };
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = verify(token, keys.jwt);
      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
