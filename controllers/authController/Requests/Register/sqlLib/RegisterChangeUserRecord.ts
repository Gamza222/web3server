import mysql from 'mysql';

interface RegisterChangeUserRecordProps {
  pool: mysql.Pool;
  userId: string;
  password: string;
  name: string;
  verifCode: string;
  verifCode_created_at: string;
  code: string;
}

export function RegisterChangeUserRecord({
  pool,
  userId,
  password,
  name,
  verifCode,
  verifCode_created_at,
  code,
}: RegisterChangeUserRecordProps) {
  const query = `UPDATE users
  SET password = ?, verifCode = ?, verifCode_created_at = ?, code = ?, name = ?
  WHERE userId = ?`;

  return new Promise((resolve, reject) => {
    pool.query(
      query,
      [password, verifCode, verifCode_created_at, code, name, userId],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  });
}
