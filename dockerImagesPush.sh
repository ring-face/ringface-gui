#!/bin/bash
cd "$(dirname "$0")"

docker push ringface/bff:latest
docker push ringface/nginx:latest

if [ -z ${1+x} ]
  then
  echo "semver is not defined"
  else
  echo "tagging to '$1'"
  docker push ringface/bff:$1
  docker push ringface/nginx:$1
fi


