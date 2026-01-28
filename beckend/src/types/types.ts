import { Request } from 'express';

export type RequestWithBody<T> = Request<object, object, T>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsAndBody<T, B> = Request<T, object, B>;
export type RequestWithQuery<T> = Request<object, object, object, T>;
