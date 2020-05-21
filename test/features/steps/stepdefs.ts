import { After, AfterAll, BeforeAll, Given, When, Then } from 'cucumber'
import * as request from 'supertest';
import { assert } from 'chai';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { AppModule } from '../../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { UsersService } from '../../../src/users/users.service';
import { User } from '../../../src/users/user';

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
    user.roles = user.roles.split(',').map(role => role.trim());
    await usersService.create(new User(user));
});

Given(/^I login as "([^"]*)" with password "([^"]*)"$/, async(username, password) => {
    response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: username, password: password })
        .then(res => {
            assert.exists(res.body.access_token);
            token = res.body.access_token
        });
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

Then(/^The response status is (\d+)$/, (status: number) => {
    assert.equal(response.status, status);
});

Then(/^The user "([^"]*)" does exist$/, async(username) => {
    response = await request(app.getHttpServer())
        .get(`/users/${username}`)
        .set('authorization', `Bearer ${token}`)
        .expect(200);
});

Then(/^The redirect location is "([^"]*)"$/, (uri) => {
    assert.equal(response.headers.location, uri);
});
