#!/bin/bash

# Make sure docker is installed and if not install it
if ! [ -x "$(command -v docker)" ]; then
  echo 'Docker is not installed. Installing now...' >&2
  sudo apt-get update
  sudo apt-get install -y docker.io
  echo 'Installed docker' >&2
else
  echo 'Docker is already installed' >&2
fi

# Make sure the docker service is running
if ! [ "$(systemctl is-active docker)" = "active" ]; then
  echo 'Docker service is not running. Starting it...' >&2
  systemctl start docker
  echo 'Started docker service' >&2
else
  echo 'Docker service is already running' >&2
fi

# Make sure the current working directory is where this script is located
echo "Making sure we're in the right directory" >&2
if [ -x "$(! command ls | grep -q on_startup.sh)" ]; then
  echo "Something went wrong, the current working directory does not contain this script" >&2
  exit 1
fi

dockerfile_path='.'

# If cwd is energy-exhibition and not air_pressure define the docker image path as:
if [ -d "air_pressure" ]; then
  dockerfile_path='./air_pressure'
fi

# Run the docker image
echo 'Running the docker image' >&2
docker build -t air_pressure $dockerfile_path
docker run -d --name air_pressure \
  -p 3000:3000 \
  --env NODE_ENV=production \
  --network bridge \
  air_pressure


