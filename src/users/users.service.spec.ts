import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { userJson1, userJson2, userModelMock } from '../../test/user.model.mock';

describe('UsersService', () => {
    let usersService: UsersService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [UsersService, { provide: getModelToken('User'), useValue: userModelMock }],
        }).compile();

        usersService = moduleRef.get<UsersService>(UsersService);
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            await expect(usersService.findAll()).resolves.toStrictEqual([userJson1, userJson2]);
        });
    });
});
