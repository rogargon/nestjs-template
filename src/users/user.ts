import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
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
        Object.assign(this as UserDto, values);
    }
}
