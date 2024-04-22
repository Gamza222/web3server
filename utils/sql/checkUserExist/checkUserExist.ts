import mysql from 'mysql';

interface checkUserExistsProps {
  tableName: string;
  mailValue: string;
  verifiedValue: boolean;
  pool: mysql.Pool;
}

export const checkUserExists = ({
  tableName,
  mailValue,
  verifiedValue,
  pool,
}: checkUserExistsProps): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} WHERE email = ? AND verified = ?`;

    return pool.query(
      query,
      [mailValue, verifiedValue],
      (err: any, results: any[]) => {
        if (err) {
          return reject(err);
        } else {
          console.log(results[0]);
          return resolve(results.length ? results[0] : null);
        }
      },
    );
  });
};
