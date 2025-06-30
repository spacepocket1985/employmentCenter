import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { BaseUrl } from './BaseUrl';

export const baseQuery = fetchBaseQuery({
  baseUrl: BaseUrl,
});
