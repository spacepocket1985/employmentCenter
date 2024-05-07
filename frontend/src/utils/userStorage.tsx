import { UserInfoFromDBType } from "../types/types";


export const userStorage = {
  saveUserInLocalStorage(user: UserInfoFromDBType) {
    localStorage.setItem('token', user.token as string);
    localStorage.setItem('user', user.name as string);
  },
};
