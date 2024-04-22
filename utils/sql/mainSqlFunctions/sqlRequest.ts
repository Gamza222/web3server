import 'dotenv/config';
import mysql from 'mysql';

function sqlRequest(
  query: string,
  props: Array<string | boolean | number>,
  pool: mysql.Pool,
) {
  return new Promise((resolve, reject) => {
    pool.query(query, [...props], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

export { sqlRequest };
