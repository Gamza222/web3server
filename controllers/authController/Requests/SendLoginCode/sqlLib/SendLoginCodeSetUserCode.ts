import mysql from 'mysql';

interface RegisterChangeUserRecordProps {
  pool: mysql.Pool;
  userId: string;
  verifCode: string;
  verifCode_created_at: string;
}

export function SendLoginCodeSetUserCode({
  pool,
  userId,
  verifCode,
  verifCode_created_at,
}: RegisterChangeUserRecordProps) {
  const query = `UPDATE users
  SET verifCode = ?, verifCode_created_at = ?
  WHERE userId = ?`;

  return new Promise((resolve, reject) => {
    pool.query(
      query,
      [verifCode, verifCode_created_at, userId],
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
