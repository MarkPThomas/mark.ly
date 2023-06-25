#!/bin/bash

echo "Running migrations for Postgres"

yarn typeorm migration:run

export PGPASSWORD=$POSTGRES_PASSWORD

echo $PGPASSWORD

echo "Running postgres-scripts"
for f in `ls /postgres-scripts`; do
 echo "  $f"
 psql -h $POSTGRES_HOST -U $POSTGRES_USERNAME $POSTGRES_DATABASE -a -f "/postgres-scripts/$f" > /dev/null
done


