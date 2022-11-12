# Fragments UI
A web app to manage `fragments` authentication and test back-end. Designed to be used for development and as a demo only.

## Installation

Run `npm install` to install dependencies.

## Usage

Run `npm start` in order to start the development server using Parcel at `localhost:1234`.

## Docker

- `docker build -t devils2ndself/fragments-ui:alpine -t devils2ndself/fragments-ui:latest .` - build the image (requires ~30mb of disk space)

- `docker run [-d | -it] --init --rm -p 1234:80 devils2ndself/fragments-ui:alpine` - run container in background (`-d` for running in background, `-it` for interactive shell)

- `docker kill <sha>` - stop the container