FROM node:23-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm && pnpm install

COPY . .
ARG VITE_BUILD_MODE
RUN echo "Building with mode=${VITE_BUILD_MODE}" && \
    npx vite build --mode=$VITE_BUILD_MODE

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
