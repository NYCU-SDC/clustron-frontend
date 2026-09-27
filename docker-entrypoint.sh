#!/bin/sh
set -e

: "${BACKEND_URL:=http://localhost:8080}"
export BACKEND_URL

envsubst '${BACKEND_URL}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"