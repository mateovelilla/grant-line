FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
## todo: refactor the following script, tha hardlinks are getting problem
RUN pnpm --filter=api deploy --prod /prod/api --legacy

FROM base AS api
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE 4000
CMD [ "pnpm", "start" ]