#!/bin/bash

# Make sure docker is installed and if not install it
if ! [ -x "$(command -v docker)" ]; then
  echo 'Error: docker is not installed.' >&2
  sudo apt-get update
  sudo apt-get install -y docker.io
fi

# Make sure docker-compose is installed and if not install it
if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  sudo apt-get update
  sudo apt-get install -y docker-compose
fi

# Make sure the docker service is running
if ! [ "$(systemctl is-active docker)" = "active" ]; then
  echo 'Error: docker service is not running.' >&2
  sudo systemctl start docker
fi

# Change to the directory where the docker-compose.yml file is located
cd /home/air_pressure || exit 1

# Run the docker-compose up command to start the containers
docker-compose up -d

