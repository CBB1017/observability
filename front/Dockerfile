FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Nginx로 제공
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# 환경 변수 삽입 스크립트 복사
COPY env.sh /docker-entrypoint.d/env.sh

EXPOSE 80

CMD ["sh", "/docker-entrypoint.d/env.sh"]