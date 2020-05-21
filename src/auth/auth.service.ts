import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';
import bcrypt = require("bcrypt");

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService,
                private readonly jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<User> {
        const user: User = await this.usersService.findOne(username);
        if (user) {
            const match = await bcrypt.compare(pass, user.password);
            if (match) {
                user.password = "";
                return user;
            }
        }
        return null;
    }

    async login(user: User) {
        const payload = { sub: user.username };
        return {
            'access_token': this.jwtService.sign(payload),
        };
    }
}
