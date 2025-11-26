#!/bin/sh
# Script de inicio para nginx que reemplaza variables de entorno
if [ -n "$API_SERVICE_URL" ]; then
    # Reemplazar la URL del backend en nginx.conf
    sed -i "s|http://api-service:3000|$API_SERVICE_URL|g" /etc/nginx/conf.d/default.conf
fi
# Iniciar nginx
exec nginx -g 'daemon off;'

