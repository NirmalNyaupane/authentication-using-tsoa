import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { UserRole } from "../../constants/enum";
import { CommonEntity } from "../common/common.entity";
import { Media } from "../media/media.entity";
@Entity()
export class User extends CommonEntity {
    @Column({nullable:false})
    fullName:string;

    @Column({nullable:false, unique:true})
    email:string;

    @Column({nullable:false, select:false})
    password:string;

    @Column({nullable:false, default:false})
    isVerified:boolean;

    @Column({type:"enum", enum:UserRole, nullable:false})
    role:UserRole

    @OneToOne(()=>Media)
    @JoinColumn()
    profile:Media;
}
