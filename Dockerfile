# syntax=docker/dockerfile:1

# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:latest as base
WORKDIR /app

# install with --production (exclude devDependencies)
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production --verbose

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser
COPY --from=base /app/node_modules node_modules
COPY --chown=appuser . .

CMD [ "bun", "dev" ]