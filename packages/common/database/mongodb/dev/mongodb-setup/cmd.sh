#!/bin/bash

echo "Running migrations for MongoDB"

yarn typeorm migration:run

export PGPASSWORD=$POSTGRES_PASSWORD

echo $PGPASSWORD

echo "Running mongodb-scripts"
for f in `ls /mongodb-scripts`; do
 echo "  $f"
 psql -h $POSTGRES_HOST -U $POSTGRES_USERNAME $POSTGRES_DATABASE -a -f "/mongodb-scripts/$f" > /dev/null
done


