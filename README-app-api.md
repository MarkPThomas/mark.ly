# app-api
Template setup for a separate backend app that may be hosted on a different node from the frontend app, so it is communicated with via an API.

## Setup
1. Copy & rename directory
2. Do a find-replace of all files contained, replacing: \
   `app-api` with the name of the app \
   `APP_API` with the name of the app \
   `BASE_URL=/app-api` with the base URL from which the package will run \
   `app_api_pg` with the name of the database \
   `appApiPgGuest` with the name of the database user

   If using REST: \

   If using GraphQL: \
   `app-frontent-url` with the URL route(s) leading to the API. Also directory name under `apollo-gql`. Duplicate if more than one. \
   `mountAppFrontendUrlGQL` with the camelCase of the url route(s) named above. If more than one, add additional imports in `app.ts`

3. Customize supporting files as desired.
4. Run `yarn install`

## Usage
This template is set up to streamline CI/CD procedures & DevOps. Fundamentaliy this means that most if not all command line interaction with the app should be by issuing commands to scripts defined in one file, depending on the level of engagement with the app.

### Local Usage
When working locally, such as for running tests, issue `package.json` scripts using `yarn`, such as: \
`yarn build`      - Builds the project locally \
`yarn start-dev`  - Runs the project locally

### Global Usage
When working with multiple apps, which includes this one, issue `Makefile` scripts at the top level in the overall project, such as: \
`make init`          - Initialize project from scratch, including database migrations, container image generation, running containers, etc. \
`make clear_project` - Tears down all built aspects of the project, including shutting down containers and removing images.

See the project root [ReadMe](../../README.md) for more information.

## Testing
There are 3 types of tests run (unit, integration, acceptance), which are run in two different environments (default, and dev). Dev environments run tests from within a running container.

Unit and integration tests for a given file are located in a separate testing file at the same directory location as the tested file.

Acceptance tests are located in a dedicated directory at the root: `/test/acceptance`

Test files are designated by the following format: `{fileTested}.[u|i|a]spec.ts`.

### Unit Tests
Unit tests should mock any and all calls to database repos or calls to other services. Unit tests are typically designated by `u`.

Filename: \
`{fileTested}.spec.ts`

Commands: \
`yarn test:u`         - Runs all unit tests directly \
`yarn test:u:dev`     - Runs all unit tests within a container environment \
`make run_unit_tests` - Runs all unit tests within a container environment

### Integration Tests
Any tests that may include limited calls to a database or service is an integration test. These require database migration and seeding test data before testing. Integration tests are typically designated by `i`.

Filename: \
`{fileTested}.ispec.ts` \

Commands: \
`yarn test:i`                - Runs all integration tests directly \
`yarn test:i:dev`            - Runs all integration tests within a container environment \
`make run_integration_tests` - Runs all integration tests within a container environment

### Acceptance Tests
Acceptance tests run on a more fully functional environment and test complex interactions and flow that align more with user stories rather than basic functionality. Acceptance tests are typically designated by `a`.

Filename: \
`{fileTested}.aspec.ts`

Commands: \
`yarn test:a`                - Runs all acceptance tests directly \
`yarn test:a:dev`            - Runs all acceptance tests within a container environment \
`make run_acceptance_tests`  - Runs all acceptance tests within a container environment

## Databases
Postgres is the default database set up to be used.

### Postgres
Postgres is the default database set up to be used. Most of this implementation is pulled over from the `Common` package.

### Mongo
Mongo is another database option to be used. Most of this implementation is pulled over from the `Common` package.

## Containers
The app is set up to be containerized using Docker. Images are built & managed by calling docker-compose at the project root.
`Dockerfile`      - Default docker file for building the image
`Dockerfile.dev`  -

## Message Brokers
RabbitMQ is set up in the basic supporting files for easy hooks for further setup. It currently is not running.