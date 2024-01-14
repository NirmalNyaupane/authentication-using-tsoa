import { UserRole } from "../../constants/enum";
import { User } from "../../entities";

type UserFilterOption = {
    page?: number,
    limit?: number,
    search?: string,
    role?: UserRole
}
class UserService {
    async findUserById(userId: string) {
        return await User.findOneBy({ id: userId });
    }
    async getAllUser(options: UserFilterOption) {
        // const query = {} as FindManyOptions<User>
        // if (options && options.limit) {
        //     query.take = options.limit;

        //     if (options.page) {
        //         const skip = (options.page - 1) * options.limit;
        //         query.skip = skip;
        //         console.log("skip", skip)
        //     }
        // }
        // if (options && options.search) {
        //     query.where = {
        //         fullName: ILike(`%${options.search}%`),
        //     }
        // }


        const builder = User.createQueryBuilder("user");
        if (options.search) {
            builder.where("user.fullName ILIKE :name", {
                name: `%${options.search}%`
            })
        }
        if (options.limit) {
            builder.take(options.limit)

            if (options.page) {
                const skip = (options.page - 1) * options.limit;
                builder.offset(skip);
            }
        }
        if (options.role) {
            builder.andWhere("user.role=:role", {
                role: options.role
            })
        }
        return await builder.getManyAndCount();
    }
}

export default new UserService();