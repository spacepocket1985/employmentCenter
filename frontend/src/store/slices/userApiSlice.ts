import { api, authUrl } from '@store/config';
import { InfoFromDBType, UserInfoFromDBType, UserType } from 'src/types/types';

export const userApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<InfoFromDBType<UserInfoFromDBType>, UserType>({
      query: (user) => ({
        url: authUrl,
        method: 'POST',
        body: user,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = userApiSlice;
