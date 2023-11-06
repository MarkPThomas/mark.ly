# mark.ly
Personal website app and supporting app projects, with a focus on GIS, outdoor activities & trip reports.

My main Mark.ly project that contains these apps is in a [multi-project monorepo](https://kinsta.com/blog/monorepo-vs-multi-repo/) structure, with the idea that I may build it out as a [monolith-to-microservices](https://www.atlassian.com/microservices/microservices-architecture/microservices-vs-monolith) hybrid as the repo transitions to a hybrid model.

See my [Wiki](https://markpthomas.github.io/wiki/Apps_819631.html) for more information.

# GIS.ly
🎉🎉🎉 This is currently my most mature project within this repo 🎉🎉🎉 \
[See it here](https://github.com/MarkPThomas/mark.ly/tree/main/packages/GIS-ly#gisly).

# Projects
The following is a list of active projects in this repo.

## Apps
These are under active development

### [GIS.ly](https://github.com/MarkPThomas/mark.ly/tree/main/packages/GIS-ly#gisly)
App for GIS-oriented work, such as Track cleaning, route planning.

### [Weather.ly](https://github.com/MarkPThomas/mark.ly/tree/main/packages/weather-ly#weatherly)
App for planning trips using weather & air quality data.

### [Rack.ly](https://github.com/MarkPThomas/mark.ly/tree/main/packages/rack-ly#rackly)
App for climbing group rack logistics, especially for gear-heavy destinations like Indian Creek.

## Libraries
### [common](https://github.com/MarkPThomas/mark.ly/tree/main/packages/common)
Contains code used across multiple projects. Sometimes code may be replicated, but this code is worth being a shared dependency.

## Libraries to Extract
These are either set to be their own compiled projects here, or extracted to a dedicated repo. Size/complexity/usage has organically evolved to this state.

### Math
[common->Math](https://github.com/MarkPThomas/mark.ly/tree/main/packages/common/utils/math#math)
In progress, being ported from C#.

### Geometry
[common->Geometry](https://github.com/MarkPThomas/mark.ly/tree/main/packages/common/utils/geometry#geometry) to be merged with [GIS.ly->Geometry](https://github.com/MarkPThomas/mark.ly/tree/main/packages/GIS-ly/ui/src/model/Geometry#geometry) once C# porting is complete.

### Data Structures
[common->Data Structures](https://github.com/MarkPThomas/mark.ly/tree/main/packages/common/utils/dataStructures#data-structures)

### Unit Conversions
[common->Unit Conversions](https://github.com/MarkPThomas/mark.ly/tree/main/packages/common/utils/units/conversion#units-conversion)

### GeoJSON
[GIS.ly->GeoJSON](https://github.com/MarkPThomas/mark.ly/tree/main/packages/GIS-ly/ui/src/model/GeoJSON#geojson)

### GIS
[GIS.ly->GIS](https://github.com/MarkPThomas/mark.ly/tree/main/packages/GIS-ly/ui/src/model/GIS#gis)

## Template Projects
To assist in creating new projects or standardizing existing ones, I am fleshing out some 'Hello World' template projects.

### [_-ly](https://github.com/MarkPThomas/mark.ly/tree/main/packages/_-ly) (to be removed)
<!-- * [app-api]() - NodeJS projects. Libraries & back-end.
* [app-ui]() - React projects. Front-end.
* [app-allInOne]() - Projects with somewhat coupled front-end/back-end. Basically full-stack apps that are mostly standalone in this repo. -->

## Apps (TBD)
Basically palceholders for now. These are set aside for future development. They may be further split apart or merged to existing projects.

### [Data.ly](https://github.com/MarkPThomas/mark.ly/tree/main/packages/data-ly)
Service for source of truth data shared between multiple apps.

### [Media.ly](https://github.com/MarkPThomas/mark.ly/tree/main/packages/media-ly)
Service for handling photos, videos, references, etc. with CRUD as well as serving as a data source for other apps.

### [Report.ly](https://github.com/MarkPThomas/mark.ly/tree/main/packages/report-ly)
App for CRUDing trip reports/blogs.

### [Scraper.ly](https://github.com/MarkPThomas/mark.ly/tree/main/packages/scraper-ly)
Web scrapers for pulling/pushing data between Mark.ly apps & other websites.

### [Trip.ly](https://github.com/MarkPThomas/mark.ly/tree/main/packages/trip-ly)
App for planning trips.

### [Climbing.ly](https://github.com/MarkPThomas/mark.ly/tree/main/packages/climbing-ly)
Climbing-focused app.