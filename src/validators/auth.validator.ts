import {
    IsEmail,
    IsEnum,
    IsJWT,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    Length
  } from "class-validator";
import { UserRole } from "../constants/enum";
  
  class RegisterUserValidation {
    @IsNotEmpty()
    @IsString()
    fullName: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role:UserRole
  }
  
  class EmailVerificationValidatior {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @Length(5, 5)
    otp: number;
  }
  
  class InitializePasswordResetValidator {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  }
  
  class FinalizePasswordResetValidator {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
  
    @IsNotEmpty()
    @IsStrongPassword()
    newPassword: string;
  }
  
  class LoginValidator{
    @IsNotEmpty()
    @IsEmail()
    email:string;
  
    @IsNotEmpty()
    @IsStrongPassword()
    password:string;
  }

  class GenerateAccessToken{
    @IsNotEmpty()
    @IsJWT()
    refreshToken:string
  }
  export {
    EmailVerificationValidatior,
    InitializePasswordResetValidator,
    RegisterUserValidation,
    FinalizePasswordResetValidator,
    LoginValidator, 
    GenerateAccessToken
  };