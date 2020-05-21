import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user';
import { getModelToken } from '@nestjs/mongoose';
import { userJson1, userJson2 } from '../../test/user.model.mock';

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: UsersService;

    const demoUser = new User(userJson1);
    const demoUser2 = new User(userJson2);

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService, { provide: getModelToken('User'), useValue: {} }],
        }).compile();

        usersService = moduleRef.get<UsersService>(UsersService);
        usersController = moduleRef.get<UsersController>(UsersController);
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            jest.spyOn(usersService, 'findAll').mockImplementation(() =>
                new Promise((resolve, ) => { resolve([demoUser, demoUser2])}));
            await expect(usersController.findAll()).resolves.toStrictEqual([demoUser, demoUser2]);
        });
    });
});
