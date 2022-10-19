# Stage 1: install dependencies

FROM node:16.14.2@sha256:6e54786b2ad01667d46524e82806298714f50d2be72b39706770aed55faedbd7 AS builder

WORKDIR /fragments-ui

# Set as production (no dev dependencies)
ENV NODE_ENV=production

# Copy source code
COPY . .

# Install node dependencies defined in package.json
RUN npm ci

# Build the app
RUN npm run build

###########################

# Stage 3: run on nginx (alpine for smaller image size)

FROM nginx:1.22.0-alpine@sha256:addd3bf05ec3c69ef3e8f0021ce1ca98e0eb21117b97ab8b64127e3ff6e444ec

WORKDIR /fragments-ui

# Copy the build from previous image
COPY --from=builder /fragments-ui/dist /usr/share/nginx/html/

# Open port 80
EXPOSE 80