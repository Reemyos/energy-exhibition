#!/bin/bash

# Make sure git is installed and if not install it
if ! [ -x "$(command -v git)" ]; then
  echo 'Error: git is not installed.' >&2
  sudo apt-get update
  sudo apt-get install -y git
fi

# Clone the repository
if [ -d "/home/energy-exhibition" ]
  then
    echo 'Repo already cloned.' >&2
    git -C /home/energy-exhibition pull --rebase
  else
    git clone https://github.com/Reemyos/energy-exhibition.git /home/energy-exhibition
fi

# Make sure docker is installed and if not install it
if ! [ -x "$(command -v docker)" ]; then
  echo 'Docker is not installed. Installing now...' >&2
  sudo apt-get update
  sudo apt-get install -y docker.io
fi

# Make sure docker-compose is installed and if not install it
if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'docker-compose is not installed. Installing now...' >&2
  sudo apt-get update
  sudo apt-get install -y docker-compose
fi

# Make sure the docker service is running
if ! [ "$(systemctl is-active docker)" = "active" ]; then
  echo 'Docker service is not running. Starting it...' >&2
  sudo systemctl start docker
fi

# Change to the directory where the docker-compose.yml file is located
cd /home/energy-exhibition || exit 1

# Run the docker-compose up command to start the containers
docker-compose up -d

