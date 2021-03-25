#!/bin/bash

cd "$(dirname "$0")"


docker build --tag ringface/bff:latest -f Dockerfile.bff .
docker build --tag ringface/nginx:latest -f Dockerfile.nginx .

if [ -z ${1+x} ]
  then
  echo "semver is not defined"
  else
  echo "tagging to '$1'"
  docker tag ringface/bff:latest ringface/bff:$1
  docker tag ringface/nginx:latest ringface/nginx:$1
fi
