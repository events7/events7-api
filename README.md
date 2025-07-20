## Description

Event tracker for Outfit7 technical assessment.

## Prerequisites

- Install node
- Install docker

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

Visit [http://localhost:3000/docs](http://localhost:3000/docs) for documentation.

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

## Assumptions made

1. When updating (not creating) event and changing its type (from/to `ADS`) I assumed that there is no need to check if user has permission - probably for the production ready app this should be implemented but let's just leave it as it for current scope of assignment.

2. Since it is not easy to isolate 403 and 201 HTTP requests on `/api/events (POST)` for `events.e2e-spec.ts` tests we are testing if the response is 201 or 403. Anyway, this is tested using unit tests so if they fails then obviously something is wrong.

3. ...

## Stay in touch

- Author - [Goran Tubic](https://github.com/orangeGoran)

## License

This project is MIT.
