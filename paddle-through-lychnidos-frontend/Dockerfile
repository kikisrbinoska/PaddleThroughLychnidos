## Build stage - installs deps and produces the Vite production build.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* vars into the bundle at build time, so this has to be
# a build arg (not a compose `environment:` entry, which only affects the
# running container - the static files are already baked by then). This
# must point at wherever the browser can reach the API (the host-mapped
# port), not the internal `api` service hostname/port.
ARG VITE_API_BASE_URL=http://localhost:8080/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

## Runtime stage - static files served by nginx.
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
