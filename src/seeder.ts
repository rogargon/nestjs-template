import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User } from './users/user';

@Injectable()
export class Seeder {

    constructor(private readonly userService: UsersService) {}

    async seed() {
        if (!await this.userService.exists('admin')) {
            const admin = new User({ username: 'admin', password: 'password', email: 'admin@nest.js',
                fullname: 'Administrator', organization: 'NestJS', roles: ['admin'] });
            await this.userService.create(admin);
            console.log('Creating admin user')
        }
    }
}
