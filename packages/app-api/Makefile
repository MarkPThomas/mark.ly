default:
	@echo "app-api"
	@echo ""
	@echo "Usage:"
	@echo "== Tests =="
	@echo "\tmake run_all_tests               # Initializes a fresh project with new .env variables, dependency installations, images, services, and built frontends"
	@echo "\tmake run_unit_tests               # Initializes a fresh project with new .env variables, dependency installations, images, services, and built frontends"
	@echo "\tmake run_integration_tests               # Initializes a fresh project with new .env variables, dependency installations, images, services, and built frontends"
	@echo "\tmake run_acceptance_tests               # Initializes a fresh project with new .env variables, dependency installations, images, services, and built frontends"


run_all_tests: run_unit_tests run_integration_tests run_acceptance_tests

prepare_test_env:
   @echo "Remove volumes ..."
   docker-compose -f ../../docker-compose.test.yml down --volumes --remove-orphans
   @echo "Build common ..."
   docker-compose -f ../../docker-compose.test.yml build common
   @echo "Build postgres ..."
   docker-compose -f ../../docker-compose.test.yml build postgres
   @echo "Run pg migrations ..."
   docker-compose -f ../../docker-compose.test.yml run -e HOST=postgres -e PORT=5432 -e DATABASE=app_api_pg -e USER=appApiPgGuest -e PASSWORD=password common ./ci/migration.sh yarn typeorm migration:run
   @echo "Build package ..."
   docker-compose -f ../../docker-compose.test.yml build app-api
run_unit_tests:
   @echo "Run unit tests ..."
   docker-compose -f ../../docker-compose.test.yml run app-api yarn test:u
run_integration_tests:
   @echo "Run integration tests ..."
   docker-compose -f ../../docker-compose.test.yml run app-api yarn test:i
run_acceptance_tests:
   @echo "Run acceptance tests ..."
   docker-compose -f ../../docker-compose.test.yml run app-api yarn test:a
