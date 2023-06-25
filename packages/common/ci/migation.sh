#!/bin/sh
# migration.sh


cmd="$@"


until PGPASSWORD=$PASSWORD psql -h "$HOST" -U "$USER" -d "$DATABASE" -c '\q'; do
 >&2 echo "Postgres is unavailable - sleeping"
 sleep 1
done


>&2 echo "Postgres is up - Running migration ..."
exec $cmd