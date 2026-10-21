#!/bin/sh
set -eu

psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --set=ON_ERROR_STOP=1 <<'SQL'
REVOKE ALL ON SCHEMA public FROM PUBLIC;
SELECT format('REVOKE CONNECT, TEMPORARY ON DATABASE %I FROM PUBLIC', current_database()) \gexec
SQL

create_service_role() {
  schema="$1"
  password_variable="$2"
  password="$3"

  if [[ -z "$password" ]]; then
    printf 'Missing required environment variable: %s\n' "$password_variable" >&2
    exit 1
  fi

  psql \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --set=ON_ERROR_STOP=1 \
    --set=schema="$schema" \
    --set=service_role="veigo_$schema" \
    --set=service_password="$password" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'service_role', :'service_password') \gexec
SELECT format('CREATE SCHEMA %I AUTHORIZATION %I', :'schema', :'service_role') \gexec
SELECT format(
  'ALTER ROLE %I IN DATABASE %I SET search_path TO %I',
  :'service_role',
  current_database(),
  :'schema'
) \gexec
SELECT format(
  'GRANT CONNECT ON DATABASE %I TO %I',
  current_database(),
  :'service_role'
) \gexec
SQL
}

create_service_role user USER_DB_PASSWORD "$USER_DB_PASSWORD"
create_service_role catalog CATALOG_DB_PASSWORD "$CATALOG_DB_PASSWORD"
create_service_role search SEARCH_DB_PASSWORD "$SEARCH_DB_PASSWORD"
create_service_role booking BOOKING_DB_PASSWORD "$BOOKING_DB_PASSWORD"
create_service_role payment PAYMENT_DB_PASSWORD "$PAYMENT_DB_PASSWORD"
create_service_role dealer DEALER_DB_PASSWORD "$DEALER_DB_PASSWORD"
create_service_role inventory INVENTORY_DB_PASSWORD "$INVENTORY_DB_PASSWORD"
create_service_role rental RENTAL_DB_PASSWORD "$RENTAL_DB_PASSWORD"
create_service_role notification NOTIFICATION_DB_PASSWORD "$NOTIFICATION_DB_PASSWORD"
