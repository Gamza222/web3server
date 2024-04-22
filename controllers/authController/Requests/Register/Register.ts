import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mysql from 'mysql';
import DbConfig from 'db/config';
import moment from 'moment';

import { v4 as uuidv4 } from 'uuid';
import { Response, Request } from 'express';
import {
  createUserSchema,
  UsersData,
  UsersTableName,
} from '../../schema/createUserSchema';
import { checkUserExists, createTable } from 'utils/sql';
import { RegisterChangeUserRecord } from './sqlLib/RegisterChangeUserRecord';
import { validateRequest } from 'utils/lib/validateRequest/validateRequest';
import { RegisterInsertRecord } from './sqlLib/RegisterInsertUserRecord';
import { SendMailCode } from 'utils/requests/SendMailCode/SendMailCode';
import { responceData } from 'controllers/types';

const Register = async (req: Request, res: Response) => {
  const { name, email, password, code }: UsersData = req.body;

  const pool = mysql.createPool(DbConfig);
  await createTable(pool, createUserSchema)
    .then(result => console.log(`${UsersTableName} table exists!`))
    .catch(error => console.log(error.message));

  if (validateRequest(req, res, ['name', 'email', 'password', 'code'])) {
    return;
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verifCode = String(Math.floor(Math.random() * 900000) + 100000);
    const emailMessage = verifCode;

    const user: UsersData = {
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      userId: uuidv4(),
      name: name,
      verified: false,
      email: email,
      password: hashedPassword,
      code: code,
      verifCode: verifCode,
      verifCode_created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    const userAlreadyVerified = await checkUserExists({
      tableName: 'users',
      mailValue: user.email,
      verifiedValue: true,
      pool: pool,
    });

    const userExistsNotVerified = await checkUserExists({
      tableName: 'users',
      mailValue: user.email,
      verifiedValue: false,
      pool: pool,
    });
    if (userAlreadyVerified) {
      //error
      const errResponse: responceData = {
        error: true,
        errMessage: `Пользователь уже верефицирован!`,
        data: null,
      };

      res.status(404).json(errResponse);
    } else if (userExistsNotVerified) {
      //changes pwd  in existing not verif user
      await RegisterChangeUserRecord({
        pool,
        userId: userExistsNotVerified.userId,
        password: hashedPassword,
        name: name,
        verifCode: verifCode,
        verifCode_created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        code: user.code,
      })
        .then(async result => {
          //sends email code
          return await SendMailCode(
            user.email,
            'verefication',
            emailMessage,
            res,
          )
            .then(() => {
              //responce sending email
              const response: responceData = {
                error: false,
                data: {
                  userId: userExistsNotVerified.userId,
                },
                text: 'Код отправлен на почту, верефицируйтесь!',
              };

              return res.status(200).json(response);
            })
            .catch(err => {
              //error sending email
              const errResponse: responceData = {
                error: true,
                errMessage: `Ошибка отправки кода: ${err.message}`,
                data: null,
              };

              res.status(404).json(errResponse);
            });
        })
        .catch(err => {
          //error updading user
          const errResponse: responceData = {
            error: true,
            errMessage: `Ошибка обновалнения пользователя: ${err.message}`,
            data: null,
          };

          res.status(404).json(errResponse);
        });
    } else {
      //creates new user
      await RegisterInsertRecord(pool, user)
        .then(async result => {
          //send code to email
          return await SendMailCode(
            user.email,
            'verefication',
            emailMessage,
            res,
          )
            .then(() => {
              //responce sending email
              const response: responceData = {
                error: false,
                data: {
                  userId: user.userId,
                },
                text: 'Код отправлен на почту, верефицируйтесь!',
              };
              return res.status(200).json(response);
            })
            .catch(err => {
              //error sending email
              const errResponse: responceData = {
                error: true,
                errMessage: `Ошибка отправки кода: ${err.message}`,
                data: null,
              };

              res.status(404).json(errResponse);
            });
        })
        .catch(err => {
          //error inserting user
          const errResponse: responceData = {
            error: true,
            errMessage: `Ошибка добавления пользователя: ${err.message}`,
            data: null,
          };

          res.status(404).json(errResponse);
        });

      return;
    }
  }
};

export default Register;
