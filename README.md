# Fragments UI
A web app to manage `fragments` authentication and test back-end. Designed to be used for development and as a demo only.

## Installation

Run `npm install` to install dependencies.

## Usage

Run `npm start` in order to start the development server using Parcel at `localhost:1234`.

## Docker

- `docker build -t fragments-ui:alpine` - build the image (requires ~30mb of disk space)

- `docker run -d --rm -p 8080:80 fragments-ui:alpine` - run container in background

- `docker kill <sha>` - stop the container