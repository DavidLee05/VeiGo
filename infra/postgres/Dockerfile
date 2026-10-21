FROM postgres:17-alpine

COPY --chmod=755 init/10-create-service-schemas.sh /docker-entrypoint-initdb.d/10-create-service-schemas.sh
RUN sed -i 's/\r$//' /docker-entrypoint-initdb.d/10-create-service-schemas.sh
