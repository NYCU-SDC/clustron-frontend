FROM node:23-alpine AS builder
WORKDIR /app

COPY . .
RUN npm install -g pnpm && pnpm install


ARG VITE_BUILD_MODE
RUN echo "Building with mode=${VITE_BUILD_MODE}" && \
    npx vite build --mode=$VITE_BUILD_MODE

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
