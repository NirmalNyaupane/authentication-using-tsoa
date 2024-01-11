import { User } from "../../entities";
import { generateHashValue } from "../../utils/helper";
import { RegisterUserValidation } from "../../validators/auth.validator";

class UserService {
    async findUserByEmail(email: string) {
        const user = await User.createQueryBuilder("user").select(["user.id", "user.fullName", "user.email", "user.password", "user.isVerified", "user.role"]).where("user.email=:email", {
            email: email
        }).getOne();
        return user;
    }

    async findUserById(id: string) {
        const user = await User.createQueryBuilder("user").select(["user.id", "user.fullName", "user.email", "user.password", "user.isVerified", "user.role"]).where("user.id=:id", {
            id: id
        }).getOne();
        return user;
    }

    async insert(payload: RegisterUserValidation) {
        const user = new User();
        user.email = payload.email;
        user.fullName = payload.fullName;
        const hashPassword = await generateHashValue(payload.password)
        user.password = hashPassword;
        user.role = payload.role;

        const response = await User.save(user);
        return response;
    }

    async verifyEmail(user: User) {
        return await User.update({ id: user.id }, { isVerified: true })
    }

    async forgetPassword(user: User, newPassword: string) {
        const hashPassword = await generateHashValue(newPassword);
        return await User.update({ id: user.id }, { password: hashPassword });
    }
}

export default new UserService();