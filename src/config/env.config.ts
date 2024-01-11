import dotenv from "dotenv";

dotenv.config();
class EnvConfiguration {
  static PORT = process.env.PORT;
  static NODE_ENV = process.env.NODE_ENV;
  static BASE_URL = process.env.BASE_URL;
  static DB_TYPE = process.env.DB_TYPE;
  static DB_HOST = process.env.DB_HOST;
  static DB_PORT = process.env.DB_PORT || 5432;
  static DB_USERNAME = process.env.DB_USERNAME;
  static DB_PASSWORD = process.env.DB_PASSWORD;
  static DB_NAME = process.env.DB_NAME;
  //smtp variablse
  static SMTP_HOST = process.env.SMTP_HOST ?? "";
  static SMTP_PORT = +(process.env.SMTP_PORT ?? 0);
  static SMTP_PASS = process.env.SMTP_PASS ?? "";
  static SMTP_USER = process.env.SMTP_USER ?? "";

  //acces token variables 
  static ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  static ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
  //refresh token variables
  static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  static REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
  static LOG_LEVEL = process.env.LOG_LEVEL;

}

export enum Environment {
  DEVELOPMENT = "DEVELOPMENT",
  PRODUCTION = "PRODUCTION",
  TEST = "TEST",
}

export { EnvConfiguration };
