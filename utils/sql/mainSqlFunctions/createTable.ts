import mysql from 'mysql';

export function createTable(pool: mysql.Pool, schema: string): Promise<void> {
  return new Promise((resolve, reject) => {
    pool.query(schema, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}
