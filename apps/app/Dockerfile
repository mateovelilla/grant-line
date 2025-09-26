FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate \
    && pnpm add -g playwright \
    && pnpm playwright install --with-deps

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN ls -al
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm --filter scraper exec playwright install --with-deps
RUN pnpm run -r build
RUN pnpm --filter=app deploy --prod /prod/api --legacy

FROM base AS app
COPY --from=build /prod/app /prod/app
WORKDIR /prod/app

FROM nginx:alpine
COPY --from=builder /prod/app/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;"]