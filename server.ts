import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'https';
import connectDB from 'db/db';
import authRoutes from 'routes/authRoutes';

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', authRoutes);

(async () => await connectDB())();

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
