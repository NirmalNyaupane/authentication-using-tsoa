import path from "path";
export const Constant = {
  TEMP_FOLDER_PATH: path.resolve(process.cwd(), "temp"),
  UPLOAD_FOLDER_PATH: path.resolve(process.cwd(), "uploads"),
  EMAIL_VERIFICATION_EXPIRY:new Date(Date.now() + 1000*60*5) //5 minute
};
