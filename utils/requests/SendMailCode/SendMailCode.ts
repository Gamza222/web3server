import 'dotenv/config';
import { Response } from 'express';
import nodemailer from 'nodemailer';

export const SendMailCode = async (
  email: string,
  subject: string,
  text: string,
  res: Response,
) => {
  try {
    const transporter = nodemailer.createTransport({
      //   service: process.env.SERVICE,
      headers: {
        'X-PM-Message-Stream': 'outbound',
      },
      host: 'smtp.postmarkapp.com',
      service: 'smtp.postmarkapp.com',
      port: 587,
      secure: false, // use TLS
      auth: {
        user: '18b1188d-4c89-486a-b617-935af72e57f6',
        pass: '18b1188d-4c89-486a-b617-935af72e57f6',
      },
      ignoreTLS: true, // add this
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.log(error.message);
        return;
      } else {
        console.log('Server is ready to take our messages');
      }
    });

    return await transporter.sendMail({
      from: 'info@web3up.io',
      to: 'info@web3up.io',
      subject: subject,
      text: text,
    });
  } catch (err: any) {
    throw new Error(err.message);
  }
};
