# Content Authoring Home API
## Unit
docker-compose -f docker-compose.test.yml run content-authoring-home-api yarn test:u:ci
## Integration
docker-compose -f docker-compose.test.yml run content-authoring-home-api yarn test:i:ci
## Acceptance
docker-compose -f docker-compose.test.yml run content-authoring-home-api yarn test:a:ci

# Author Home
## Unit
docker-compose -f docker-compose.test.yml run author-home-app yarn test:u:ci
## Integration
docker-compose -f docker-compose.test.yml run author-home-app yarn test:i:ci
## Acceptance
docker-compose -f docker-compose.test.yml run author-home-app yarn test:a:ci