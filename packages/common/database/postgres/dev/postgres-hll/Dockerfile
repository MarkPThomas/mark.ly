FROM postgres:14

RUN apt-get update && apt-get install wget make gcc g++ postgresql-server-dev-${PG_MAJOR} -y

RUN wget -c https://github.com/citusdata/postgresql-hll/archive/v2.16.tar.gz  -O - | tar -xz

WORKDIR /postgresql-hll-2.16

RUN PG_CONFIG=/usr/bin/pg_config make && PG_CONFIG=/usr/bin/pg_config make install

RUN echo "shared_preload_libraries = 'hll'" >> /usr/share/postgresql/postgresql.conf.sample




