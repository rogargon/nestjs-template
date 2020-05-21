export const userJson1 = {
    username: 'demo1', password: 'password', email: 'demo1@demo.org', fullname: 'Demo1',
    organization: 'Demo', roles: ['demo'] };
export const userJson2 = {
    username: 'demo2', password: 'password', email: 'demo2@demo.org', fullname: 'Demo2',
    organization: 'Demo', roles: ['demo'] };

export const userModelMock = {
    save: jest.fn().mockResolvedValue(userJson1),
    find: jest.fn().mockResolvedValue([userJson1, userJson2]),
    findOne: jest.fn().mockResolvedValue(userJson1),
    findOneAndUpdate: jest.fn().mockResolvedValue(userJson1),
    deleteOne: jest.fn().mockResolvedValue(true),
};
