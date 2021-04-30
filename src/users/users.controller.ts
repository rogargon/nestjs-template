import { Body, Controller, Param, Delete, Get, Post, Put, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ReqUser } from '../utils/requser.decorator';
import { UserDto } from './user';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin')
    findAll(): Promise<UserDto[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    findOne(@Param('id') id: string): Promise<UserDto> {
        return this.usersService.findOne(id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin')
    async create(@Body() user: UserDto): Promise<UserDto> {
        return this.usersService.create(user);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    update(@ReqUser() auth: UserDto, @Param('id') id: string, @Body() newUser: UserDto) {
        return this.usersService.updateOne(auth, id, newUser);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(RolesGuard) // Does nothing if @Roles not defined, just to check it is ignored
    @UseGuards(AuthGuard('jwt'))
    remove(@ReqUser() auth: UserDto, @Param('id') id: string) {
        return this.usersService.deleteOne(auth, id);
    }
}
