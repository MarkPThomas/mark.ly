default:
	@echo "Mark.ly CLI"
	@echo ""
	@echo "Usage:"
	@echo "== Project =="
	@echo "\tmake init               # Initializes a fresh project with new .env variables, dependency installations, images, services, and built frontends"
	@echo "\tmake init_setup         # Initializes fresh .env variables and installs all node dependencies in the project"
	@echo "\tmake init_start_project # Initializes all frontends in the project and any related images and services"
	@echo "\tmake clear_project      # Deletes all .env files and installed node dependencies in the project"
	@echo ""
	@echo "=== Files ==="
	@echo "\tmake setup_envs         # Copies all .env.example files as .env where .env doesn't exist"
	@echo "\tmake delete_envs        # Deletes all .env files from packages"
	@echo "\tmake install_deps       # Installs all node dependencies required for project"
	@echo "\tmake delete_deps        # Deletes all node dependencies required for project"
	@echo ""
	@echo "=== Containers ==="
	@echo ""
	@echo "=== Databases ==="
	@echo ""
	@echo "=== Builds ==="
	@echo "\tmake build_frontends    # Builds the frontend of all apps"
	@echo "\tmake build_weather_ly   # Builds the frontend to the weather.ly app"
	@echo ""
	@echo "=== Services ==="

# Project
init: init_setup init_start_project

init_setup: delete_envs setup_envs install_deps
# init_setup: delete_envs setup_envs pull_images install_deps setup_pm2

init_start_project: build_frontends
# init_start_project: start_containers wait_for_containers run_migrations run_seeds build_frontends start_services

restart_backend: stop_containers nuke_containers start_containers run_migrations run_seeds

start_project: start_containers start_services

stop_project: stop_services stop_containers

clear_project: delete_deps delete_envs
# clear_project: nuke_containers nuke_services delete_deps delete_envs

# Files
setup_envs:
	@echo "Generating .env files from .env.example files..."
	find ./packages -name ".env.example" -exec dirname {} \; | exargs -t -I % cp -n %/.env.example %/.env

delete_envs:
	@echo "Deleting all .env files from project..."
	find .packages -name ".env" | exargs -t -r -n 1 rm

install_deps:
	@echo "Installing all dependencies in project..."
	yarn
	@while read p; do \
		echo "Installing dependencies for $$p ..."; \
		cd "$$p" && yarn && cd $$(git rev-parse --show-toplevel); \
	done <packages-list.txt

delete_deps:
	@echo "Deleting all dependencies from project..."
	find . -type d -name 'node_modules' -prune -exec rm -Rf '{}' +

# Containers
pull_images:
   @echo "Pulling images for Docker..."
   docker-compose pull


start_containers:
   @echo "Starting Docker containers..."
   docker-compose up -d


stop_containers:
   @echo "Stopping Docker containers..."
   docker-compose stop


nuke_containers:
   @echo "Nuking Docker containers..."
   docker-compose down -v --remove-orphans

# Databases
run_migrations_postgres:
#	@echo "Running migrations for Postgress..."
#	cd ./packages/common; yarn typeorm migration:run

run_migrations: run_migrations_postgres

create_test_db_postgres:
#	@echo "Setup local PG database for testing ..."
# cd ./packages/common; export PGPASSWORD=password; pg_dump -U nexus -h localhost content_authoring_home -s > schema.sql; yarn typeorm query "`cat ../dev/postgres-setup/test-db/create_test_db.sql`"; psql -U nexus -h localhost content_authoring_home_test < schema.sql; rm schema.sql;

drop_test_db_postgres:
#	@echo "Drop local PG database for testing ..."
#	cd ./packages/common; yarn typeorm query "`cat ../dev/postgres-setup/test-db/drop_test_db.sql`"

run_seeds:
	@echo "Running seeds for postgres..."
#	cat ./packages/dev/postgres-setup/postgres-scripts/* | docker-compose exec -T postgres psql -U nexus -d content_authoring_home
	@echo "Finished seeding postgres..."

# Builds
build_weather_ly:
	@echo "Building weather.ly..."
	cd ./packages/app/ui; yarn build

build_frontends: build_weather_ly

# Services
setup_pm2:
	@echo "Setup PM2 TypeScript support..."
	yarn pm2 install typescript

start_services:
	@echo "Starting services..."
	yarm pm2 start ecosystem.config.js

recreate_services:
   @echo "Recreating project services..."
   yarn pm2 delete ecosystem.config.js
   yarn pm2 start ecosystem.config.js


restart_services:
   @echo "Restarting project services..."
   yarn pm2 restart ecosystem.config.js


stop_services:
   @echo "Stopping services..."
   yarn pm2 stop ecosystem.config.js


nuke_services:
   @echo "Nuking services..."
   yarn pm2 delete ecosystem.config.js


ps:
   yarn pm2 ps ecosystem.config.js

