FROM node:24.13.0-alpine3.22 AS base

WORKDIR /workspace
ENV NODE_ENV=production

FROM base AS deps

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/studio/package.json apps/studio/package.json
COPY apps/cms/package.json apps/cms/package.json

RUN npm ci --ignore-scripts --no-audit --no-fund

FROM deps AS dev

COPY . .
ENV NODE_ENV=development
EXPOSE 1337

CMD ["npm", "run", "dev:cms"]

FROM deps AS builder

COPY . .
ENV NODE_ENV=production

RUN npm --workspace apps/cms --ws run build

FROM node:24.13.0-alpine3.22 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=1337

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 strapi

RUN apk --no-cache add curl

ENV STRAPI_DISABLE_UPDATE_NOTIFICATION=1
ENV STRAPI_TELEMETRY_DISABLED=1

RUN mkdir -p /app/public/uploads && chown -R strapi:nodejs /app

COPY --from=builder --chown=strapi:nodejs /workspace/apps/cms/public ./public
COPY --from=builder --chown=strapi:nodejs /workspace/apps/cms/.cache ./.cache
COPY --from=builder --chown=strapi:nodejs /workspace/apps/cms/build ./build
COPY --from=builder --chown=strapi:nodejs /workspace/apps/cms/node_modules ./node_modules
COPY --from=builder --chown=strapi:nodejs /workspace/apps/cms/package.json ./package.json

USER strapi

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -f http://127.0.0.1:1337/_health || exit 1

CMD ["node", "build/server.js"]
