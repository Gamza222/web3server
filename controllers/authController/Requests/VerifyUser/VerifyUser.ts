import 'dotenv/config';
import mysql from 'mysql';

import DbConfig from 'db/config';

import { Response, Request } from 'express';
import { validateRequest } from 'utils/lib/validateRequest/validateRequest';
import { VerifyUserData } from 'controllers/authController/schema/createUserSchema';
import { CompareUserVerifyCodes } from 'utils/sql/compareUserVerifyCodes/compareUserVerifyCodes';
import { VerifyUserSetStatus } from './sqlLib/VerifyUserSetStatus';
import { responceData } from 'controllers/types';

const VerifyUser = async (req: Request, res: Response) => {
  const pool = mysql.createPool(DbConfig);
  const { userId, code }: VerifyUserData = req.body;

  if (validateRequest(req, res, ['userId', 'code'])) {
    return;
  }

  await CompareUserVerifyCodes({
    pool: pool,
    code: code,
    userId: userId,
  })
    .then(async result => {
      await VerifyUserSetStatus({ pool, userId })
        .then(() => {
          //responce if user verified
          const response: responceData = {
            error: false,
            data: {
              userId: userId,
            },
            text: 'Код отправлен на почту, верефицируйтесь!',
          };
          return res.status(200).send(response);
        })
        .catch(err => {
          //error set status of user
          const errResponse: responceData = {
            error: true,
            errMessage: `Ошибка верефикации пользователя!: ${err.message}`,
            data: null,
          };
          return res.status(404).send(errResponse);
        });
    })
    .catch(err => {
      //error comparing codes!
      const errResponse: responceData = {
        error: true,
        errMessage: `Ошибка отправки кода: ${err.message}`,
        data: null,
      };
      return res.status(404).send(errResponse);
    });
};

export default VerifyUser;
