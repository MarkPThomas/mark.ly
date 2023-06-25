default:
	@echo "app-api"
	@echo ""
	@echo "Usage:"
	@echo "== Project =="
	@echo "\tmake prepare_test_env               # Initializes a fresh project with new .env variables, dependency installations, images, services, and built frontends"


prepare_test_env:
   @echo "Remove volumes ..."
   docker-compose -f ../../docker-compose.test.yml down --volumes --remove-orphans
   @echo "Build common ..."
   docker-compose -f ../../docker-compose.test.yml build common
   @echo "Build postgres ..."
   docker-compose -f ../../docker-compose.test.yml build postgres
   @echo "Run pg migrations ..."
   docker-compose -f ../../docker-compose.test.yml run -e HOST=postgres -e PORT=5432 -e DATABASE=content_authoring_home -e USER=nexus -e PASSWORD=password common ./ci/migration.sh yarn typeorm migration:run
   @echo "Build package ..."
   docker-compose -f ../../docker-compose.test.yml build content-authoring-home-api
run_unit_tests:
   @echo "Run unit tests ..."
   docker-compose -f ../../docker-compose.test.yml run content-authoring-home-api yarn test:u
run_integration_tests:
   @echo "Run integration tests ..."
   docker-compose -f ../../docker-compose.test.yml run content-authoring-home-api yarn test:i
run_acceptance_tests:
   @echo "Run acceptance tests ..."
   docker-compose -f ../../docker-compose.test.yml run content-authoring-home-api yarn test:a
run_all_tests: run_unit_tests run_integration_tests run_acceptance_tests
