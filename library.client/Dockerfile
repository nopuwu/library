# build stage
FROM node:20 AS build
WORKDIR /app
COPY library.client/package*.json ./
RUN npm install
COPY library.client ./
RUN npm run build

# production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
