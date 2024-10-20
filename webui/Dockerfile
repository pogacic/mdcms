# Build static web app
FROM node:lts-alpine as build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build


# Serve static built files
FROM nginx:mainline-alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80