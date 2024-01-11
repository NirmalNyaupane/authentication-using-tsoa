
import nodemailer from 'nodemailer';
import { EnvConfiguration } from './env.config';
const transporter = nodemailer.createTransport({
    host: EnvConfiguration.SMTP_HOST,
    port: EnvConfiguration.SMTP_PORT,
    // secure: true,
    auth: {
      user: EnvConfiguration.SMTP_USER,
      pass: EnvConfiguration.SMTP_PASS,
    },
  });

  export default transporter;