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
COPY env.sh /usr/share/nginx/html/env.sh
RUN chmod +x /usr/share/nginx/html/env.sh

EXPOSE 80

CMD ["sh", "/usr/share/nginx/html/env.sh"]