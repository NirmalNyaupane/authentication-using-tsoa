import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { CommonEntity } from "../common/common.entity";
import { User } from "../user/user.entity";

@Entity("token")
export class Token extends CommonEntity {
    @Column({ nullable: true })
    emailVerification: string;

    @Column({ nullable: true, type: "timestamp" })
    emailVerificationExpiry: Date;

    @Column({ nullable: true })
    forgetPassword: string;

    @Column({ nullable: true, type: "timestamp" })
    forgetPasswordExpiry: Date;

    @Column({ nullable: true })
    refreshToken: string;
    
    @OneToOne(() => User)
    @JoinColumn()
    user: User
}