#!/bin/bash

docker build --tag ringface/bff:latest -f Dockerfile.bff .
docker build --tag ringface/nginx:latest -f Dockerfile.nginx .
