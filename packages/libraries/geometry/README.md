# Geometry
Need more out of a shapes library than basic lines, curves, & bounding box collisions for video games? This library allows deep and complex modeling of polylines, polygons, and more, with an ability to get detailed shape properties and segment information, such as normal vectors.

![image](https://github.com/MarkPThomas/mark.ly/assets/6684303/b69382ea-c3d4-4f7f-a74d-5885f8975599)

## Documentation
See the [Project Wiki](https://markpthomas.github.io/wiki/Geometry_52723714.html) for topics like:
- Complete product description
- Demos
- How-to articles
- API documentation
- Algorithms, diagrams, and other development documentation

## Internal Dependencies
The following libraries in the `MarkPThomas` namespace are used in this project. Each one has its own documentation and independently usable NPM package.
- [Data-Structures](https://github.com/MarkPThomas/mark.ly/tree/main/packages/libraries/data-structures)

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
