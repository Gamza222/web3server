import mysql from 'mysql';

import {
  UsersData,
  UsersTableName,
} from 'controllers/authController/schema/createUserSchema';

export function RegisterInsertRecord(pool: mysql.Pool, user: UsersData) {
  const query = `INSERT INTO ${UsersTableName}
    SET ?`;
  return new Promise((resolve, reject) => {
    pool.query(query, [user], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
