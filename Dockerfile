FROM nginx:stable

LABEL maintainer = "Artem Tanyhin" \
    description = "fragments-ui webapp for testing fragments microservice"

# Setup node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \ 
    && apt-get update && apt-get install -y \
        build-essential \
        nodejs \
    && rm -fr /var/lib/apt/lists/*

# Copy source code
WORKDIR /usr/local/src/fragments-ui
COPY . .

# Build the website
# And copy the distribution to nginx directory
RUN npm ci
RUN npm run build \
    && cp -a ./dist/. /usr/share/nginx/html/

# Open port 80
EXPOSE 80