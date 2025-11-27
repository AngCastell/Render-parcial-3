#!/bin/sh
# Script de inicio para nginx que reemplaza variables de entorno
if [ -n "$API_SERVICE_URL" ]; then
    # Reemplazar la URL del backend en nginx.conf
    # Asegurar que la URL no termine con / para proxy_pass
    BACKEND_URL=$(echo "$API_SERVICE_URL" | sed 's|/$||')
    
    # Extraer el hostname para proxy_ssl_name y Host header
    if echo "$BACKEND_URL" | grep -q "^https://"; then
        BACKEND_HOST=$(echo "$BACKEND_URL" | sed 's|https://||' | sed 's|/.*||')
        # Agregar proxy_ssl_name después de proxy_ssl_server_name (solo para HTTPS)
        sed -i "/proxy_ssl_server_name on;/a\        proxy_ssl_name $BACKEND_HOST;" /etc/nginx/conf.d/default.conf
        # Actualizar el header Host para que apunte al api-service
        sed -i "s|proxy_set_header Host \$host;|proxy_set_header Host $BACKEND_HOST;|g" /etc/nginx/conf.d/default.conf
        echo "Configurado SSL hostname: $BACKEND_HOST"
    else
        # Si es HTTP, usar el hostname de la URL
        BACKEND_HOST=$(echo "$BACKEND_URL" | sed 's|http://||' | sed 's|:.*||' | sed 's|/.*||')
        # Actualizar el header Host para que apunte al api-service
        sed -i "s|proxy_set_header Host \$host;|proxy_set_header Host $BACKEND_HOST;|g" /etc/nginx/conf.d/default.conf
        echo "Configurado backend hostname: $BACKEND_HOST"
    fi
    
    # Escapar caracteres especiales para sed
    BACKEND_URL_ESCAPED=$(echo "$BACKEND_URL" | sed 's/[[\.*^$()+?{|]/\\&/g')
    sed -i "s|http://api-service:3000|$BACKEND_URL_ESCAPED|g" /etc/nginx/conf.d/default.conf
    echo "Configurado backend URL: $BACKEND_URL"
else
    echo "API_SERVICE_URL no configurada, usando configuración por defecto"
fi
# Iniciar nginx
exec nginx -g 'daemon off;'

