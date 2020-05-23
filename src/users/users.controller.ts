import { Body, Controller, Param, Delete, Get, Post, Put, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user';
import { UsersService } from './users.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ReqUser } from '../utils/requser.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin')
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin')
    async create(@Body() user: User): Promise<User> {
        return this.usersService.create(user);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    update(@ReqUser() auth: User, @Param('id') id: string, @Body() newUser: User) {
        return this.usersService.updateOne(auth, id, newUser);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(AuthGuard('jwt'))
    remove(@ReqUser() auth: User, @Param('id') id: string) {
        return this.usersService.deleteOne(auth, id);
    }
}
