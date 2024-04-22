import { UsersTableName } from 'controllers/authController/schema/createUserSchema';
import mysql from 'mysql';

export default function clearUserCode(connection: mysql.PoolConnection) {
  connection.query(
    `
      DELETE FROM ${UsersTableName} 
      WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 DAY) 
      AND verified = FALSE
    `,
    (error, results, fields) => {
      if (error) {
        console.error('Error deleting unverified users:', error);
      } else {
        console.log('Unverified users deleted successfully');
      }
    },
  );
}
