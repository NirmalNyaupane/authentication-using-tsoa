import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { EnvConfiguration } from '../config/env.config';
import { UserRole } from '../constants/enum';
const generateToken = () => {
    return crypto.randomBytes(64).toString("hex");
}


const generateHashValue = async (value:string)=>{
    return await bcrypt.hash(value, 10)
}
const verifyHashValue = async (plainText: string, hashValue: string) => {
    return await bcrypt.compare(plainText, hashValue);
}

/**
 * 
 * @param userId it is id of user
 * @param role It is a roel of user
 * @returns Access token of user
 */
const generateAccessToken = (userId: string, role: UserRole) => {
    return jwt.sign({ sub: userId, role: role }, EnvConfiguration.ACCESS_TOKEN_SECRET ?? "", {
        expiresIn: EnvConfiguration.ACCESS_TOKEN_EXPIRY
    })
}

const generateRefreshToken = (userId: string) => {
    return jwt.sign({ sub: userId}, EnvConfiguration.REFRESH_TOKEN_SECRET ?? "", {
        expiresIn: EnvConfiguration.REFRESH_TOKEN_EXPIRY
    })
}


export { generateAccessToken, generateToken, verifyHashValue, generateHashValue, generateRefreshToken};
