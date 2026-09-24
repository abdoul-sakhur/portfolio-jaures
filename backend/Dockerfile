# ---- Base ----
FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build (compiles TS + admin panel) ----
FROM deps AS build
COPY . .
ENV NODE_ENV=production
RUN npm run build

# ---- Production ----
FROM node:22-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/config ./config
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/public ./public
COPY --from=build /app/database ./database
COPY --from=build /app/favicon.png ./favicon.png

RUN mkdir -p /app/.tmp /app/public/uploads

EXPOSE 1337
CMD ["npm", "run", "start"]
