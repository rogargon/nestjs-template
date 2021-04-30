import { After, AfterAll, BeforeAll, Given, When, Then, DataTable } from 'cucumber'
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { AppModule } from '../../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { UsersService } from '../../../src/users/users.service';
import { UserDto } from '../../../src/users/user';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const expect = require('expect');

let mongod: MongoMemoryServer;
let app: INestApplication;
let usersService: UsersService;
let response;
let token = '';

BeforeAll(async() => {
    mongod = new MongoMemoryServer();
    process.env.MONGODB_URI = await mongod.getUri();
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    usersService = app.get(UsersService);
    await app.init();
});

After(async() => {
    await usersService.deleteAll();
});

AfterAll(async() => {
    await app.close();
    await mongod.stop();
});


Given(/^There is a user$/, async(table) => {
    const user = table.hashes()[0];
    user.roles = user.roles && user.roles.split(',').map(role => role.trim());
    await usersService.create(new UserDto(user));
});

Given(/^I login as "([^"]*)" with password "([^"]*)"$/, async(username, password) => {
    response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: username, password: password })
        .then(res => {
            if (res.body.access_token) {
                token = res.body.access_token
            } else {
                token = '';
            }
        });
});

Given(/^I'm not logged in$/, () => {
    token = '';
});

Given(/^The user "([^"]*)" does not exist$/, async(username) => {
    response = await request(app.getHttpServer())
        .get(`/users/${username}`)
        .set('authorization', `Bearer ${token}`)
        .expect(404);
});

When(/^I create the user$/, async(table) => {
    const user = table.hashes()[0];
    user.roles = user.roles.split(',').map(role => role.trim());
    response = await request(app.getHttpServer())
        .post('/users')
        .set('authorization', `Bearer ${token}`)
        .send(user);
});

When(/^I visit my profile$/, async() => {
    response = await request(app.getHttpServer())
        .get('/profile')
        .set('authorization', `Bearer ${token}`);
});

When(/^I list all users$/, async() => {
    response = await request(app.getHttpServer())
        .get('/users')
        .set('authorization', `Bearer ${token}`);
});

When(/^I update user with username "([^"]*)" with$/, async(username: string, table: DataTable) => {
    const user = table.hashes()[0];
    user.roles = user.roles.split(',').map(role => role.trim());
    response = await request(app.getHttpServer())
        .put(`/users/${username}`)
        .set('authorization', `Bearer ${token}`)
        .send(user);
});

When(/^I delete user with username "([^"]*)"$/, async(username: string) => {
    response = await request(app.getHttpServer())
        .del(`/users/${username}`)
        .set('authorization', `Bearer ${token}`);
});

Then(/^The response status is (\d+)$/, (status: number) => {
    expect(response.status).toBe(status);
});

Then(/^The user "([^"]*)" does exist$/, async(username: string) => {
    response = await request(app.getHttpServer())
        .get(`/users/${username}`)
        .set('authorization', `Bearer ${token}`)
        .expect(200);
});

Then(/^The redirect location is "([^"]*)"$/, (uri: string) => {
    expect(response.headers.location).toBe(uri);
});

Then(/^The profile username is "([^"]*)"$/, (username: string) => {
    expect(response.body.username).toBe(username);
});

Then(/^The response includes (\d+) users$/, (count: number, table: DataTable) => {
    expect(response.body.length).toBe(count);
    const expected = table.hashes().map(user => { user.roles = new Array(user.roles); return user; } )
        .sort((a, b) => a.username.localeCompare(b.username));
    expect(response.body.sort((a, b) => a.username.localeCompare(b.username))).toMatchObject(expected);
});

Then(/^The response is user$/, (table: DataTable) => {
    const expected = table.hashes()[0]
    expected.roles = expected.roles.split(', ');
    expect(response.body).toMatchObject(expected);
});

Then(/^The error message is "([^"]*)"$/, (message) => {
    expect(response.body.message).toBe(message);
});
