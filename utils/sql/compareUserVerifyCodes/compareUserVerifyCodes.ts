import { UsersTableName } from 'controllers/authController/schema/createUserSchema';
import moment from 'moment';
import mysql from 'mysql';

interface VerifyCodeCompareCodesProps {
  pool: mysql.Pool;
  userId: string;
  code: string;
}

export function CompareUserVerifyCodes({
  pool,
  userId,
  code,
}: VerifyCodeCompareCodesProps) {
  const query = `
    SELECT *
    FROM ${UsersTableName}
    WHERE userId = ?`;

  return new Promise((resolve, reject) => {
    pool.query(query, [userId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        const thresholdMinutes = 2;
        const verifCode = result.length > 0 ? result[0].verifCode : null;
        const verifCodeCreatedAt =
          result.length > 0 ? result[0].verifCode_created_at : null;
        const diffMinutes = moment().diff(verifCodeCreatedAt, 'minutes');

        // Check if the difference is less than or equal to the threshold
        const isWithinThreshold = diffMinutes <= thresholdMinutes;

        if (isWithinThreshold) {
          if (verifCode == code) {
            resolve(true);
          } else {
            reject({
              message: 'Неправильный код!',
            });
          }
        } else {
          reject({
            message: 'Код истек, попробуйте запросить код снова!',
          });
        }
      }
    });
  });
}
