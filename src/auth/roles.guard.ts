import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
                private readonly usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user: User = await this.usersService.findOne(request.user.username);
        if (!user || !user.roles || user.roles.length == 0) {
            return false;
        }
        return this.matchRoles(roles, user.roles);
    }

    private matchRoles(requiredRoles: string[], userRoles: any): boolean {
        const satisfiedRoles = requiredRoles.filter(role => userRoles.includes(role));
        return satisfiedRoles.length > 0;
    }
}
