#!/bin/sh
set -e

# Iniciar microserviço Node.js interno em segundo plano
node /app/server/index.mjs &

# Iniciar servidor Nginx em primeiro plano
exec nginx -g "daemon off;"
