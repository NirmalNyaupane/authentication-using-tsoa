import { Token } from "../../entities/token/token.entity";
import { Constant } from '../../constants/constants';
import { User } from "../../entities";
class TokenService {
    async insertEmailVerificationToken(hashToken: string, user: User) {
        //token exits or not 
        //if token exits update the token
        const token = await Token.createQueryBuilder("token")
            .leftJoin("token.user", "user")
            .select(["token.emailVerification", "token.id"])
            .where("user.email=:email", {
                email: user.email,
            })
            .getOne();

        if (token) {
            return await Token.update({ id: token?.id }, {
                emailVerification: hashToken, emailVerificationExpiry
                    : Constant.EMAIL_VERIFICATION_EXPIRY
            })
        }

        //if not create a token 
        const newToken = new Token();
        newToken.emailVerification = hashToken;
        newToken.emailVerificationExpiry = Constant.EMAIL_VERIFICATION_EXPIRY;
        newToken.user = user;
        return await Token.save(newToken);
    }

    async insertForgetPasswordToken(hashToken: string, user: User) {
        //token exits or not 
        //if token exits update the token
        const token = await Token.createQueryBuilder("token")
            .leftJoin("token.user", "user")
            .select(["token.forgetPassword", "token.id"])
            .where("user.email=:email", {
                email: user.email,
            })
            .getOne();
        console.log(token);
        if (token) {
            const res =  await Token.update({ id: token?.id }, {
                forgetPassword: hashToken, forgetPasswordExpiry
                    : Constant.EMAIL_VERIFICATION_EXPIRY
            })

            console.log(res)
            return res;
        }

        //if not create a token 
        const newToken = new Token();
        newToken.forgetPassword = hashToken;
        newToken.forgetPasswordExpiry = Constant.EMAIL_VERIFICATION_EXPIRY;
        newToken.user = user;
        return await Token.save(newToken);
    }

    async findEmailVerificationToken(user:User) {
        const currentDate = new Date(Date.now());
        const findToken = await Token.createQueryBuilder("token")
            .leftJoin("token.user", "user")
            .select("token.emailVerification")
            .where("user.email=:email", {
                email: user.email,
            })
            .andWhere("token.emailVerificationExpiry > :current", {
                current: currentDate,
            })
            .getOne();

        return findToken;
    }

    async findForgetPasswordToken(user:User) {
        const currentDate = new Date(Date.now());
        const findToken = await Token.createQueryBuilder("token")
            .leftJoin("token.user", "user")
            .select("token.forgetPassword")
            .where("user.email=:email", {
                email: user.email,
            })
            .andWhere("token.forgetPasswordExpiry > :current", {
                current: currentDate,
            })
            .getOne();

        return findToken;
    }

    async insert(hashToken: string, user: User) {
        //token exits or not 
        //if token exits update the token
        const token = await Token.createQueryBuilder("token")
            .leftJoin("token.user", "user")
            .select(["token.forgetPassword", "token.id"])
            .where("user.email=:email", {
                email: user.email,
            })
            .getOne();

        if (token) {
            return await Token.update({ id: token?.id }, {
                forgetPassword: hashToken, forgetPasswordExpiry
                    : Constant.EMAIL_VERIFICATION_EXPIRY
            })
        }

        //if not create a token 
        const newToken = new Token();
        newToken.forgetPassword = hashToken;
        newToken.forgetPasswordExpiry = Constant.EMAIL_VERIFICATION_EXPIRY;
        newToken.user = user;
        return await Token.save(newToken);
    }
}

export default new TokenService();