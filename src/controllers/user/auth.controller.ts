import express from 'express';
import { Body, Controller, Get, Middlewares, Path, Post, Request, Route, Tags } from "tsoa";
import { EnvConfiguration } from "../../config/env.config";
import { RequestValidator } from '../../middlewares/validator.middleware';
import { default as authService, default as userService } from "../../services/auth/auth.service";
import tokenService from "../../services/token/token.service";
import { generateAccessToken, generateHashValue, generateRefreshToken, generateToken, verifyHashValue } from "../../utils/helper";
import { HTTPStatusCode } from "../../utils/httpStatusCode.util";
import { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail } from "../../utils/mail.util";
import { FinalizePasswordResetValidator, GenerateAccessToken, InitializePasswordResetValidator, LoginValidator, RegisterUserValidation } from "../../validators/auth.validator";
import jwt from 'jsonwebtoken';
@Route("auth")
@Tags("Authentication")
export class AuthController extends Controller {
    @Post("/register-user")
    @Middlewares(RequestValidator.validate(RegisterUserValidation))
    async registerUser(@Request() req: express.Request, @Body() reqBody: RegisterUserValidation) {
        //check user with given email is already register or not
        const user = await userService.findUserByEmail(reqBody.email);
        if (user) {
            throw new Error("Email is already registered")
        }

        const userResponse = await userService.insert(reqBody);
        const emailValidationToken = generateToken();
        const hashEmailValidationToken = await generateHashValue(emailValidationToken);

        //store hashToken in database 
        const tokenResponse = await tokenService.insertEmailVerificationToken(hashEmailValidationToken, userResponse);
        if (tokenResponse) {
            //send email 
            sendEmail({
                email: reqBody.email,
                subject: "Email verification",
                mailgenContent: emailVerificationMailgenContent(reqBody.fullName, `${EnvConfiguration.BASE_URL}/auth/email-verification/${userResponse.id}/${emailValidationToken}`)
            })
        }

        return userResponse;
    }

    @Get("/email-verification/:userId/:token")
    async emailVerification(@Path() userId: string, @Path() token: string) {
        const user = await authService.findUserById(userId);
        if (!user) {
            throw new Error("Email is not registered");
        }
        const tokenResponse = await tokenService.findEmailVerificationToken(user);
        if (!tokenResponse) {
            throw new Error("Token is not found or expired")
        }

        const isTokenCorrect = await verifyHashValue(token, tokenResponse.emailVerification);

        if (!isTokenCorrect) {
            throw new Error("Token is incorrect");
        }

        const emailVerificationResponse = await userService.verifyEmail(user);
        if (emailVerificationResponse) {
            return { message: "Email is verified" }
        } else {
            throw new Error("Internal Server Error")
        }
    }

    @Post("/forgot-password")
    @Middlewares(RequestValidator.validate(InitializePasswordResetValidator))
    async forgotPassword(@Body() body: InitializePasswordResetValidator) {
        const user = await userService.findUserByEmail(body.email);
        if (!user) {
            throw new Error("Email is not registered")
        }
        const passwordResetToken = generateToken();
        const hashPasswordResetToken = await generateHashValue(passwordResetToken);

        //store hashToken in database 
        const tokenResponse = await tokenService.insertForgetPasswordToken(hashPasswordResetToken, user);
        if (tokenResponse) {
            //send email 
            sendEmail({
                email: body.email,
                subject: "Email verification",
                mailgenContent: forgotPasswordMailgenContent(user.fullName, `${EnvConfiguration.BASE_URL}/auth/finalize-forgot-password/${passwordResetToken}`)
            })
        }

        return { message: "Verification link is send to your account please check you mail" }
    }

    @Post("/finalize-forgot-password/:token")
    @Middlewares(RequestValidator.validate(FinalizePasswordResetValidator))
    async finalizePasswordReset(@Body() reqBody: FinalizePasswordResetValidator, @Path() token: string) {
        const user = await userService.findUserByEmail(reqBody.email);
        if (!user) {
            throw new Error("Email is not registered")
        }

        const tokenResponse = await tokenService.findForgetPasswordToken(user);
        if (!tokenResponse) {
            throw new Error("Token is not found or expired")
        }

        const isTokenCorrect = await verifyHashValue(token, tokenResponse.forgetPassword);
        if (!isTokenCorrect) {
            throw new Error("Invalid token")
        }

        const forgotPasswordResponse = await userService.forgetPassword(user, reqBody.newPassword);
        if (forgotPasswordResponse.affected === 1) {
            return { message: "Password changed sucessfully" }
        } else {
            throw new Error("Internal server error");
        }
    }


    @Post("login")
    @Middlewares(RequestValidator.validate(LoginValidator))
    async login(@Body() reqBody: LoginValidator) {
        const user = await userService.findUserByEmail(reqBody.email);
        if (!user) {
            throw new Error("Email is not registered");
        }
        if (!user.isVerified) {
            const emailValidationToken = generateToken();
            const hashEmailValidationToken = await generateHashValue(emailValidationToken);

            //store hashToken in database 
            const tokenResponse = await tokenService.insertEmailVerificationToken(hashEmailValidationToken, user);
            if (tokenResponse) {
                //send email 
                sendEmail({
                    email: reqBody.email,
                    subject: "Email verification",
                    mailgenContent: emailVerificationMailgenContent(user.fullName, `${EnvConfiguration.BASE_URL}/auth/email-verification/${user.id}/${emailValidationToken}`)
                })
            } else {
                throw new Error("Internal server error")
            }
            this.setStatus(HTTPStatusCode.BAD_REQUEST)
            return { message: "Email is not verified, please check your email for verification", isVerified: false }
        }


        const isPasswordCorrect = await verifyHashValue(reqBody.password, user.password);
        if (!isPasswordCorrect) {
            throw new Error("Invalid credentials")
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        //save refreshToken on 
        const refreshTokenResponse = await tokenService.insertRefreshToken(refreshToken, user);
        if (refreshTokenResponse) {
            return { id: user.id, isVerified: user.isVerified, accessToken, refreshToken, role: user.role };

        } else {
            this.setStatus(500)
            throw new Error("Internal server error")
        }
    }


    //generate accesstoken 
    @Post("/generate-access-token")
    @Middlewares(RequestValidator.validate(GenerateAccessToken))
    async generateAccessToken(@Body() body: GenerateAccessToken) {
        //decode the refresh token 
        try {
            const decodedToken = jwt.verify(body.refreshToken, EnvConfiguration.REFRESH_TOKEN_SECRET ?? "");
            //@ts-ignore
            const user = await authService.findUserById(decodedToken.sub ?? "");
            if (!user) {
                throw new Error("Invalid refresh token ")
            }

            const refreshToken = await tokenService.findRefreshToken(user);
            if(body.refreshToken!==refreshToken?.refreshToken){
                throw new Error("refresh token is not matched")
            }
            //generate access token and refresh token 
            const accessToken = generateAccessToken(user.id, user.role);
            const newRefreshToken = generateRefreshToken(user.id);

            //save refresh token into db
            const refreshTokenResponse = await tokenService.insertRefreshToken(newRefreshToken, user);
            if(refreshTokenResponse){
                return {accessToken, refreshToken:newRefreshToken}
            }else{
                this.setStatus(HTTPStatusCode.INTERNAL_SERVER_ERROR)
                throw new Error("Internal server error");
            }
        } catch (e) {
            this.setStatus(HTTPStatusCode.UNAUTHORIZED);
            throw new Error("refresh token is expired or invalid")
        }
    }

}