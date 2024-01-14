import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { EnvConfiguration } from '../config/env.config';
import { UserRole } from '../constants/enum';
import userService from '../services/user/user.service';
import asyncHandler from '../utils/asyncHandler.util';
import { HTTPStatusCode } from '../utils/httpStatusCode.util';
const verifyJwt = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(HTTPStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" })
    }
    try {
        const decodeToken = jwt.verify(token, EnvConfiguration.ACCESS_TOKEN_SECRET ?? "");
        //@ts-ignore
        const user = await userService.findUserById(decodeToken.sub ?? "");

        if (!user) {
            res.status(HTTPStatusCode.UNAUTHORIZED)
            throw new Error("Invalid token");
        }

        req.user = user
        next();
    } catch (e) {
        res.status(401);
        throw new Error("Token is expired, please login")
    }
})


const verifyPermission = (roles: UserRole[] = []) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const role = req.user?.role;

        if (!role) {
            return res.status(HTTPStatusCode.FORBIDDEN).json({ message: "Forbidden" })
        }

        if (roles.includes(role)) {
            next();
        } else {
            return res.status(HTTPStatusCode.FORBIDDEN).json({ message: "Forbidden" })
        }
    }
}

export { verifyJwt, verifyPermission };
