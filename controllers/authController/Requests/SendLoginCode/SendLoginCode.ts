import 'dotenv/config';
import mysql from 'mysql';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import DbConfig from 'db/config';

import { Response, Request } from 'express';
import { validateRequest } from 'utils/lib/validateRequest/validateRequest';
import {
  SendLoginCodeData,
  UsersTableName,
} from 'controllers/authController/schema/createUserSchema';
import { checkUserExists } from 'utils/sql';
import { SendMailCode } from 'utils/requests/SendMailCode/SendMailCode';
import { SendLoginCodeSetUserCode } from './sqlLib/SendLoginCodeSetUserCode';
import { responceData } from 'controllers/types';

const SendLoginCode = async (req: Request, res: Response) => {
  const pool = mysql.createPool(DbConfig);
  const { email, password }: SendLoginCodeData = req.body;

  if (validateRequest(req, res, ['email', 'password'])) {
    return;
  }

  await checkUserExists({
    tableName: UsersTableName,
    mailValue: email,
    verifiedValue: true,
    pool: pool,
  })
    .then(async user => {
      const passwordMatch = await bcrypt.compare(password, user.password);

      const verifCode = String(Math.floor(Math.random() * 900000) + 100000);
      const emailMessage = verifCode;

      if (passwordMatch) {
        SendLoginCodeSetUserCode({
          pool: pool,
          userId: user.userId,
          verifCode: verifCode,
          verifCode_created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
          .then(async () => {
            return await SendMailCode(
              user.email,
              'verefication',
              emailMessage,
              res,
            )
              .then(() => {
                //responce if user verified
                const response: responceData = {
                  error: false,
                  data: {
                    userId: user.userId,
                    email: user.email,
                  },
                  text: 'Код отправлен на почту, подтвердите код!',
                };
                return res.status(200).send(response);
              })
              .catch(err => {
                //error if email not sent
                const errResponse: responceData = {
                  error: true,
                  errMessage: `Ошибка отправки кода: ${err.message}`,
                  data: null,
                };

                return res.status(404).json(errResponse);
              });
          })
          .catch((err: any) => {
            //error if user code in db not set
            const errResponse: responceData = {
              error: true,
              errMessage: `Ошибка отправки кода: ${err.message}`,
              data: null,
            };

            return res.status(404).json(errResponse);
          });
      } else {
        //error if incorrect password
        const errResponse: responceData = {
          error: true,
          errMessage: `Неправильный пароль!`,
          data: null,
        };

        return res.status(404).json(errResponse);
      }
    })
    .catch(err => {
      //error if user not exist
      const errResponse: responceData = {
        error: true,
        errMessage: `Пользователь не существует!`,
        data: null,
      };

      return res.status(404).json(errResponse);
    });
};

export default SendLoginCode;
