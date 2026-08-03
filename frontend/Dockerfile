# ---------- Stage 1: build React static bundle ----------
FROM node:20-alpine AS build
WORKDIR /app

# Build arg baked into the bundle: same-origin API path
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ---------- Stage 2: serve via nginx ----------
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
