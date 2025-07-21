## Description

Event tracker for Outfit7 technical assessment.

## Prerequisites

- Install node
- Install docker

## Project setup

```bash
# clone git repository
git clone https://github.com/events7/events7-api

# change directory
cd events7-api

# install correct node version (if you haven't already)
nvm install $(cat .nvmrc)

# select correct node version
nvm use $(cat .nvmrc)

# install packages
npm install
```

### Pull git modules (shared repository)

```bash
npm run git:pull:shared
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

Open another terminal and run next commands

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

Visit [http://localhost:3000/docs](http://localhost:3000/docs) for documentation.

## Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

## Assumptions made

1. When updating (not creating) event and changing its type (from/to `ADS`) I assumed that there is no need to check if user has permission - probably for the production ready app this should be implemented but let's just leave it as it for current scope of assignment.

2. Since it is not easy to isolate 403 and 201 HTTP requests on `/api/events (POST)` for `events.e2e-spec.ts` tests we are testing if the response is 201 or 403. Anyway, this is tested using unit tests so if they fails then obviously something is wrong.

3. In order to make it easier (or not - still debatable and depends on the project) if you execute command `npm run generate:docs` it will create/update shared json file `docs.json`. This file contains much needed api configuration for generating types on frontend. Even if there is by default [http://localhost:3000/docs-json](http://localhost:3000/docs-json) I like to keep it in git so that everything is tracked and correct version can be used. Later this script could be run automatically before push so that we make sure that shared always gets newest version.

4. We assume that it is save to keep external API credentials url in the git - usually we should save it in any password manager or any other secure system. For this purpose I assumend that the external API is public since the login credentials that I have received are from public file.

5. I also assumed that there is no need for pagination and filters under `/api/v1/events` GET request. This could be implemented later.

## Usefull things

1. Check [postman/events7.postman_collection.json](postman/events7.postman_collection.json) for postman export.

## Stay in touch

- Author - [Goran Tubic](https://github.com/orangeGoran)

## License

This project is MIT.
