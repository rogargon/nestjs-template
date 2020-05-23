import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User } from './users/user';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Seeder {

    constructor(private readonly userService: UsersService,
                private readonly configService: ConfigService) {}

    async seed() {
        if (!await this.userService.exists('admin')) {
            const admin = new User({ username: 'admin', fullname: 'Administrator', email: 'admin@nest.js',
                password: this.configService.get('DEFAULT_PASSWORD', 'password'),
                organization: 'NestJS', roles: ['admin'] });
            await this.userService.create(admin);
            console.log('Creating admin user')
        }
    }
}
