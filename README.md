<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="160" alt="Nest Logo" /></a>
</p>

[Nest](https://github.com/nestjs/nest) framework TypeScript starter template repository.

![Node.js CI](https://github.com/rogargon/nestjs-template/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/rogargon/nestjs-template/branch/master/graph/badge.svg)](https://codecov.io/gh/rogargon/nestjs-template)

## Description

[Nest](https://github.com/nestjs/nest) starter repository plus:
* CORS and Helmet
* JWT authentication, AuthGuard and RolesGuard
* Request User param decorator
* Validation Pipe, Not Found interceptor and Duplicate Identifier exception with exception filter
* Simple user management API
* Samples of service and controller Jest tests
* Memory MongoDB for testing
* Cucumber e2e tests
* Seeder for default admin user
* ...

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:e2e:cov
```

## License

Nest and this repository are [MIT licensed](LICENSE).
