#!/bin/sh

echo "Injecting runtime environment variables into React app..."

# React 앱의 JavaScript 파일에서 placeholder 대체
for file in /usr/share/nginx/html/static/js/*.js; do
  sed -i "s|REACT_APP_APP_A_HOST_PLACEHOLDER|${REACT_APP_APP_A_HOST}|g" "$file"
  sed -i "s|REACT_APP_APP_B_HOST_PLACEHOLDER|${REACT_APP_APP_B_HOST}|g" "$file"
  sed -i "s|REACT_APP_APP_C_HOST_PLACEHOLDER|${REACT_APP_APP_C_HOST}|g" "$file"
  sed -i "s|REACT_APP_GRAFANA_HOST_PLACEHOLDER|${REACT_APP_GRAFANA_HOST}|g" "$file"
done

# Nginx 시작
echo "Starting Nginx..."
exec nginx -g "daemon off;"
