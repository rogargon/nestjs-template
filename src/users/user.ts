import { IsEmail, IsNotEmpty } from 'class-validator';

export class User {
    @IsNotEmpty()
    username: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
    fullname: string;
    organization: string;
    roles: string[];
    created: Date;

    constructor(values: object = {}) {
        Object.assign(this as User, values);
    }
}
