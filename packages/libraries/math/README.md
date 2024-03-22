# Math
Contains methods & objects for mathematical operations, such as vector math, point/curve intersections, coordinate conversions, 2D interpolations, cube root derivations, parametric equations, and more!

![image](https://github.com/MarkPThomas/mark.ly/assets/6684303/8fc74be5-a158-406b-8a9e-9d7af0def825)

## Documentation
See the [Project Wiki](https://markpthomas.github.io/wiki/Math_52756526.html) for topics like:
- Complete product description
- Demos
- How-to articles
- API documentation
- Algorithms, diagrams, and other development documentation

## Testing
There is one type of test run (unit), which is run in two different environments (default, and dev). Dev environments run tests from within a running container.

Unit tests for a given file are located in a separate testing file at the same directory location as the tested file.

Test files are designated by the following format `{fileTested}.[u]spec.ts`.

### Unit Tests
Unit tests should mock any and all calls to database repos or calls to other services. Unit tests are typically designated by `u`, if designated at all.

Filename: \
  `{fileTested}.spec.ts`

Commands:
* `yarn test:u`         - Runs all unit tests directly
* `yarn test:u:dev`     - Runs all unit tests within a container environment
* `make run_unit_tests` - Runs all unit tests within a container environment
