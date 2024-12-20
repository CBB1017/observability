#!/bin/sh

cat <<EOT > /usr/share/nginx/html/env.js
window.env = {
  REACT_APP_API_URL: "${REACT_APP_API_URL}",
  REACT_APP_APP_A_HOST: "${REACT_APP_APP_A_HOST}",
  REACT_APP_APP_B_HOST: "${REACT_APP_APP_B_HOST}",
  REACT_APP_APP_C_HOST: "${REACT_APP_APP_C_HOST}"
};
EOT

# Nginx 실행
exec nginx -g "daemon off;"