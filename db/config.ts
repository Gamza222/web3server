import 'dotenv/config';

const DbConfig = {
  host: process.env.HOST,
  user: process.env.USERMYSQL,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

export default DbConfig;
