## Description

Event tracker for Outfit7 technical assessment.

## Prerequisites

- Install node

## Project setup

```bash
# install correct node version (if you haven't already)
nvm install $(cat .nvmrc)

# select correct node version
nvm use $(cat .nvmrc)

# install packages
$ npm install
```

## Prepare environment variables

```bash
# just copy local .env.example to .env
cp .env.example .env
```

## Setup Docker database

```bash
# run docker compose
docker compose up
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

## Stay in touch

- Author - [Goran Tubic](https://github.com/orangeGoran)

## License

This project is MIT.
