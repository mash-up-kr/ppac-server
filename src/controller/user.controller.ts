import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'deviceID')) {
    return next(new CustomError(`'keywords' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const user = await UserService.createUser(req.body);
    return res.json({ ...user });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};
