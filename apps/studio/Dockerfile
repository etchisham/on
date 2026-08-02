FROM node:24.13.0-alpine3.22 AS base

WORKDIR /workspace
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/studio/package.json apps/studio/package.json
RUN npm ci --ignore-scripts --no-audit --no-fund

FROM deps AS dev
COPY . .
ENV NODE_ENV=development
EXPOSE 3333
CMD ["npm", "run", "dev:studio"]

FROM deps AS builder
ARG SANITY_STUDIO_PROJECT_ID
ARG SANITY_STUDIO_DATASET=production
ENV NODE_ENV=production
ENV SANITY_STUDIO_PROJECT_ID=${SANITY_STUDIO_PROJECT_ID}
ENV SANITY_STUDIO_DATASET=${SANITY_STUDIO_DATASET}
COPY . .
RUN npm run build:studio

FROM nginxinc/nginx-unprivileged:1.31-alpine AS runner

COPY --from=builder /workspace/apps/studio/dist /usr/share/nginx/html
COPY apps/studio/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
