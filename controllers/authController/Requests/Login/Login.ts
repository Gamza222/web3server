import 'dotenv/config';

import jwt from 'jsonwebtoken';
import mysql from 'mysql';
import DbConfig from 'db/config';

import { Response, Request } from 'express';
import {
  createUserSchema,
  LoginData,
  UsersTableName,
} from '../../schema/createUserSchema';
import { checkUserExists, createTable } from 'utils/sql';
import { validateRequest } from 'utils/lib/validateRequest/validateRequest';
import { CompareUserVerifyCodes } from 'utils/sql/compareUserVerifyCodes/compareUserVerifyCodes';
import { responceData } from 'controllers/types';

const Login = async (req: Request, res: Response) => {
  const { email, code }: LoginData = req.body;

  const pool = mysql.createPool(DbConfig);
  await createTable(pool, createUserSchema)
    .then(result => console.log(`${UsersTableName} table exists!`))
    .catch(error => console.log(error.message));
  if (validateRequest(req, res, ['email', 'code'])) {
    return;
  } else {
    await checkUserExists({
      tableName: UsersTableName,
      mailValue: email,
      verifiedValue: true,
      pool: pool,
    })
      .then(async user => {
        await CompareUserVerifyCodes({
          pool: pool,
          code: code,
          userId: user.userId,
        })
          .then(async () => {
            const generateAccessToken = (userId: string) => {
              return process.env.JWT_SECRET
                ? jwt.sign({ userId }, process.env.JWT_SECRET, {
                    expiresIn: '1d',
                  })
                : null;
            };

            generateAccessToken(user.userId) &&
              res.status(200).json({
                user: user,
                access_token: generateAccessToken(user.userId),
              });
          })
          .catch(err => {
            //error getting user
            const errResponse: responceData = {
              error: true,
              errMessage: `Неправильный код!`,
              data: null,
            };

            return res.status(404).json(errResponse);
          });
      })
      .catch(err => {
        //error getting user
        const errResponse: responceData = {
          error: true,
          errMessage: `Пользователь не существует: ${err.message}`,
          data: null,
        };

        return res.status(404).json(errResponse);
      });
  }
};

export default Login;
