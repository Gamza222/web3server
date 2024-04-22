import mysql from 'mysql';
import config from './config';
import cron from 'node-cron';
import deleteUnverifiedUsers from 'utils/requests/DeleteUnverifiedUsers/DeleteUnverifiedUsers';

const connectDB = async () => {
  const pool = mysql.createPool(config);
  pool.getConnection((err, connection) => {
    if (err) {
    } else {
      //delete user if not verified
      cron.schedule('0 21 * * *', () => {
        console.log('Running task to delete unverified users...');
        deleteUnverifiedUsers(connection);
      });

      console.log('Connected to MySQL database');
      connection.release();
    }
  });
};

export default connectDB;
