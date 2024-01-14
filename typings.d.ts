import { UserRole } from "./src/constants/enum";
export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        fullName: string;
        email: string;
        role: UserRole;
        isVerified: boolean;
        createdAt?: Date | undefined;
        updatedAt?: Date |undefined;
      };
    }
  }
}