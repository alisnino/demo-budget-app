#!/bin/bash

NODE_VERSION=$(cat ./node_version)

set -e
docker compose build --build-arg NODE_VERSION=$NODE_VERSION
docker compose up 