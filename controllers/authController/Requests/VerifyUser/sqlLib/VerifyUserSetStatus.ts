import mysql from 'mysql';

interface VerifyUserSetStatusProps {
  pool: mysql.Pool;
  userId: string;
}

export function VerifyUserSetStatus({
  pool,
  userId,
}: VerifyUserSetStatusProps) {
  const query = `UPDATE users
  SET verified = ?
  WHERE userId = ?`;

  return new Promise((resolve, reject) => {
    pool.query(query, [true, userId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
