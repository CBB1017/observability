#!/bin/sh
cat <<EOT > /usr/share/nginx/html/env.js
window.env = {
  REACT_APP_GRAFANA_HOST: "${REACT_APP_GRAFANA_HOST}",
  REACT_APP_APP_A_HOST: "${REACT_APP_APP_A_HOST}",
  REACT_APP_APP_B_HOST: "${REACT_APP_APP_B_HOST}",
  REACT_APP_APP_C_HOST: "${REACT_APP_APP_C_HOST}"
};
EOT
exec nginx -g "daemon off;"