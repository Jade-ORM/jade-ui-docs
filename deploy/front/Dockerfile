# syntax=docker/dockerfile:1
# Build context: jade-ui-docs repo root
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Empty → same-origin /api (nginx proxies to plugin-api)
ARG VITE_PLUGIN_API_URL=
ENV VITE_PLUGIN_API_URL=${VITE_PLUGIN_API_URL}
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY deploy/front/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
