FROM oven/bun:1-slim AS builder

WORKDIR /app

COPY bun.lock package.json ./
RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:1-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist .
COPY ./drizzle ./drizzle

ENV DATA_PATH=/data
VOLUME ["/data"]

EXPOSE 3000

CMD ["bun", "index.js"]
