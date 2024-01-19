# GIS.ly
Do you have unwanted trackpoints in your GPS recording? Did you lose satellite reception in a deep canyon? Did you forget to end your activity for Strava before driving home? Well, GIS.ly has you covered for automated & easy manual corrections.

## Coming soon: ##
- **Tracks**
    - Elevation-based functionality
    - Improved speed
    - Improved controls
    - More automation by activity
    - Custom & CRUD-able user settings for units, activity, etc.
- **Routes**
    - Trip planning features

<!-- ## Live Demo
Try it out! There is a [live demo]() available online with some sample GPS tracks. -->

## Documentation
See the [Project Wiki](https://markpthomas.github.io/wiki/GIS.ly_19333121.html) for topics like:
- Complete product description
- Demos
- How-to articles
- API documentation
- Algorithms, diagrams, and other development documentation
- Product design diagrams & notes
<!-- - Documentation such as diagrams for the app and UX styling guidelines are stored in the **`./docs`** directory. -->

<!-- ## Team Members
- [Mark Thomas](https://github.com/MarkPThomas) - [Engineering Journal](https://gist.github.com/MarkPThomas/7ce6b7a2a48820ad1995afc5ee6ba506) -->


# Demos
Below are some brief descriptions of the various app components, with animations showing their dynamic behavior.

<img alt="atelier demo" src="./docs/demos/demo_po.gif" width="50%" />

## Track Cleaning
Oftentimes a GPS track will contain inaccurate or unwanted data. The Track.ly portion of GIS.ly allows automated & manual cleaning of the recording.

### Trim Cruft
GPS tracks may have some cruft (i.e. unwanted data) at the start or end of the track that come from turning the GPS device on at multiple times without starting a new track. GIS.ly can detect this & automatically remove it. See the [Wiki](https://markpthomas.github.io/wiki/Track-Cruft_52560088.html) for more information.

<img alt="atelier demo" src="./docs/demos/demo_po.gif" width="50%" />

### Smooth by Speed
Smoothing refers to the removal of Track Points that are likely to be inaccurate. One way to do this is by determining if the average speed at a point exceeds a realistic speed for the intended activity, such as hiking. See the [Wiki](https://markpthomas.github.io/wiki/Track-Smoothing_52756672.html) for more information.

https://user-images.githubusercontent.com/6684303/130370001-9988c092-f074-426a-9003-9fa844883840.mp4

### Split by Activity
Did you forget to turn off your GPS device after your bike ride or run, & then drove home? Or what about recording multiple activities, such as in a biathlon or triathlon? GIS.ly can detect when a type of activity has changed & split the track into separate tracks for each activity. See the [Wiki](https://markpthomas.github.io/wiki/Track-Splitting_52560128.html) for more information.

<img alt="atelier demo" src="./docs/demos/demo_po.gif" width="50%" />

### Previews
Although automated cleaning can be nice, and you can always undo operations to tweak settings and try again, it may be nice to see what the affect of an operation will be before committing to it. In GIS.ly, you can preview these effects for a smoother cleaning experience.

<img alt="atelier demo" src="./docs/demos/demo_po.gif" width="50%" />

### Rebuilding Sections of a Track
Sometimes an extended section of a track is offset from a known path. Or perhaps smoothing cleanups have left some large straight segments in your Track. You can manully move or insert Trackp Points, as well as draw corrections for a segment to rebuild portions of your Track.  See the [Wiki](https://markpthomas.github.io/wiki/Track-Insertion_52756729.html) for more information.

<img alt="atelier demo" src="./docs/demos/demo_po.gif" width="50%" />


# CI/CD
<!-- ## Continuous Integration
Basic test of JavaScript continuous integration uses [CircleCI](https://circleci.com/) to run the tests, and [Coveralls](https://coveralls.io/) for reporting test coverage.

Circle CI: [![rpp29-fec-gouda](https://circleci.com/gh/rpp29-fec-gouda/atelier.svg?style=svg)](https://app.circleci.com/pipelines/github/rpp29-fec-gouda/atelier)

Coveralls: [![Coverage Status](https://coveralls.io/repos/github/rpp29-fec-gouda/atelier/badge.svg)](https://coveralls.io/github/rpp29-fec-gouda/atelier)

## SonarCloud
Additionally, [SonarCloud](https://sonarcloud.io/projects) is used for an overall check of code quality.

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rpp29-fec-gouda_atelier&metric=alert_status)](https://sonarcloud.io/dashboard?id=rpp29-fec-gouda_atelier)

Quality: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=rpp29-fec-gouda_atelier&metric=alert_status)](https://sonarcloud.io/dashboard?id=rpp29-fec-gouda_atelier)

Maintainability: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=rpp29-fec-gouda_atelier&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=rpp29-fec-gouda_atelier)

Reliability: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=rpp29-fec-gouda_atelier&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=rpp29-fec-gouda_atelier)

Security: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=rpp29-fec-gouda_atelier&metric=security_rating)](https://sonarcloud.io/dashboard?id=rpp29-fec-gouda_atelier)

Lines of Code: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=rpp29-fec-gouda_atelier&metric=ncloc)](https://sonarcloud.io/dashboard?id=rpp29-fec-gouda_atelier)

Coverage: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=rpp29-fec-gouda_atelier&metric=coverage)](https://sonarcloud.io/dashboard?id=rpp29-fec-gouda_atelier)

Bugs: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=rpp29-fec-gouda_atelier&metric=bugs)](https://sonarcloud.io/dashboard?id=rpp29-fec-gouda_atelier)

Code Smells: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=rpp29-fec-gouda_atelier&metric=code_smells)](https://sonarcloud.io/dashboard?id=rpp29-fec-gouda_atelier)

Technical Debt: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=rpp29-fec-gouda_atelier&metric=sqale_index)](https://sonarcloud.io/dashboard?id=rpp29-fec-gouda_atelier) -->

## Testing
[Jest](https://jestjs.io/) is the framework chosen to test React & most other project code.

# Usage
## Installation & Setup
- **Clone/pull repo**
- `yarn install`
<!-- - Create a GitHub authorization token and store it in **`config.js`** (make sure it's `.gitignored`). -->
- `yarn start` for the server
- `yarn build` (in a separate terminal) for webpack/react/index.html
- Navigate to `http://localhost:3000` in browser

## Local Usage
When working locally, such as for running tests, issue `package.json` scripts using  `yarn`, such as:
- `yarn build`      - Builds the project locally
- `yarn start-dev`  - Runs the project locally

## Testing
There are 3 types of tests run (unit, integration, acceptance), which are run in two different environments (default, and dev). Dev environments run tests from within a running container.

Unit and integration tests for a given file are located in a separate testing file at the same directory location as the tested file.

<!-- Acceptance tests are located in a dedicated directory at the root: `/test/acceptance` -->

Test files are designated by the following format `{fileTested}.[u|i|a]spec.ts`.

### Unit Tests
Unit tests should mock any and all calls to database repos or calls to other services. Unit tests are typically designated by `u`.

**Filename:** \
  `{fileTested}.spec.ts`

**Commands:**
- `yarn test:u`         - Runs all unit tests directly
<!-- `yarn test:u:dev`     - Runs all unit tests within a container environment \
`make run_unit_tests` - Runs all unit tests within a container environment -->

### Integration Tests
Any tests that may include limited calls to a database or service is an integration test. These require database migration and seeding test data before testing. Integration tests are typically designated by `i`. '

**Filename:** \
  `{fileTested}.ispec.ts`

**Commands:**
- `yarn test:i`                - Runs all integration tests directly
<!-- `yarn test:i:dev`            - Runs all integration tests within a container environment \
`make run_integration_tests` - Runs all integration tests within a container environment -->

### Acceptance Tests
Acceptance tests run on a more fully functional environment and test complex interactions and flow that align more with user stories rather than basic functionality. Acceptance tests are typically designated by `a`.

**Filename:** \
  `{fileTested}.aspec.ts`

**Commands:**
- `yarn test:a`                - Runs all acceptance tests directly
<!-- `yarn test:a:dev`            - Runs all acceptance tests within a container environment \
`make run_acceptance_tests`  - Runs all acceptance tests within a container environment -->

## Databases
MongoDB is the default database set up to be used.

<!-- ### Postgres
Postgres is the default database set up to be used. Most of this implementation is pulled over from the `Common` package. -->

<!-- ### MongoDB
MongoDB is another database option to be used. Most of this implementation is pulled over from the `Common` package. -->

<!-- ## Containers
The app is set up to be containerized using Docker. Images are built & managed by calling docker-compose at the project root.
`Dockerfile`      - Default docker file for building the image
`Dockerfile.dev`  - -->