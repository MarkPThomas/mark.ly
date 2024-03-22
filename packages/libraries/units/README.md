# Units
Conveniently converts between different units. Beginning with unit primitives, it builds on those to convert between more complex units, such as speed, stress, etc. The library is also set up for users to extend it in order to add support for units conversions not yet added.

The library also handles formatting with unit conversions, such as displaying Latitude/Longitude coordinates, recorded as decimal degrees, as degrees/minutes/seconds, e.g. `77.65367°` = `77°39'13.2''W`

![image](https://github.com/MarkPThomas/mark.ly/assets/6684303/2a407114-5214-4330-bdad-1748cbc27b03)


## Documentation
See the [Project Wiki](https://markpthomas.github.io/wiki/Data-Structures_52658190.html) for topics like:
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
