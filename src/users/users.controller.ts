import { Body, Controller, Param, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user';
import { UsersService } from './users.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DuplicateIdentifierException } from '../utils/duplicate-identifier.exception';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin')
    async create(@Body() user: User): Promise<User> {
        if (await this.usersService.exists(user.username))
            throw new DuplicateIdentifierException(`${user.username}`);
        return this.usersService.create(user);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() user: User) {
        return `TODO: Update user ${id} with ${user}`;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return `TODO: Delete user ${id}`;
    }
}
