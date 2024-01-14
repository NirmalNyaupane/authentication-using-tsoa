import * as express from "express";
import * as jwt from "jsonwebtoken";
import { EnvConfiguration } from "../config/env.config";
import { UserRole } from "../constants/enum";
import userService from "../services/user/user.service";

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: UserRole[]
) {

    if (securityName === "jwt") {
        const authenticationHeader = request.headers?.authorization?.split(" ");
        const token = authenticationHeader?.[1];
        return new Promise((resolve, reject) => {
            if (authenticationHeader?.[0] !== "Bearer") {
                reject(new Error("Unauthorized"))
            }
            if (!token) {
                reject(new Error("Unauthorized"));
            }
            jwt.verify(token ?? "", EnvConfiguration.ACCESS_TOKEN_SECRET ?? "", function (err: any, decoded: any) {
                if (err) {
                    reject(err);
                } else {
                    const user = userService.findUserById(decoded.sub);
                    if (scopes) {
                        if (!scopes.includes(decoded?.role)) {
                            reject(new Error("Forbidden resource"));
                        }

                    }
                    resolve(user);
                }
            });
        });
    }
}
