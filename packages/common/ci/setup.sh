# Build common
docker-compose -f docker-compose.test.yml build common
docker-compose -f docker-compose.test.yml build postgres

docker-compose -f docker-compose.test.yml build author-home-app

docker-compose -f docker-compose.test.yml build content-home-api

# Run common db migrations
docker-compose -f docker-compose.test.yml run -e HOST=postgres -e PORT=5432 -e DATABASE=content_authoring_home -e USER=nexus -e PASSWORD=password common ./ci/migration.sh yarn typeorm migration:run