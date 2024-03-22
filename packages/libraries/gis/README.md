# GIS
GIS is a one-stop shop for GIS work, such as generating layers for Leaflet, CRUD and auto-cleaning features for routes & tracks. It is made to be extensible, so you can derive your own custom objects and methods of manipulating & cleaning them.
![image](https://github.com/MarkPThomas/mark.ly/assets/6684303/47746807-6bca-4737-a9f8-5d29fa615929)


## Documentation
See the [Project Wiki](https://markpthomas.github.io/wiki/GIS_52756784.html) for topics like:
- Complete product description
- Demos
- How-to articles
- API documentation
- Algorithms, diagrams, and other development documentation

## Internal Dependencies
The following libraries in the `MarkPThomas` namespace are used in this project. Each one has its own documentation and independently usable NPM package.
- [GeoJSON](https://github.com/MarkPThomas/mark.ly/tree/main/packages/libraries/geojson)
- [Units](https://github.com/MarkPThomas/mark.ly/tree/main/packages/libraries/units)
- [Data-Structures](https://github.com/MarkPThomas/mark.ly/tree/main/packages/libraries/data-structures)
- [History](https://github.com/MarkPThomas/mark.ly/tree/main/packages/libraries/history)
- [Math](https://github.com/MarkPThomas/mark.ly/tree/main/packages/libraries/math) (In the process of being ported from C#)
- [Geometry](https://github.com/MarkPThomas/mark.ly/tree/main/packages/libraries/geometry)
- [Geometry-CSharp](https://github.com/MarkPThomas/mark.ly/tree/main/packages/libraries/geometry-csharp) (In the process of being ported from C#. Will ulimately be merged with 'Geometry' library)

## Testing
There is one type of test run (unit), which is run in two different environments (default, and dev). Dev environments run tests from within a running container.

Unit tests for a given file are located in a separate testing file at the same directory location as the tested file.

Test files are designated by the following format `{fileTested}.[u]spec.ts`.

### Unit Tests
Unit tests should mock any and all calls to database repos or calls to other services. Unit tests are typically designated by `u`, if designated at all.

**Filename:** \
  `{fileTested}.spec.ts`

**Commands:**
* `yarn test:u`         - Runs all unit tests directly
* `yarn test:u:dev`     - Runs all unit tests within a container environment
* `make run_unit_tests` - Runs all unit tests within a container environment
