#!/bin/bash

# Make sure npm is installed and if not install it
if ! [ -x "$(command -v npm)" ]; then
  echo 'npm is not installed. Installing now...' >&2
  apt-get update
  apt-get install -y npm
  echo 'Installed npm' >&2
else
  echo 'npm is already installed' >&2
fi

# If cwd is energy-exhibition and not air_pressure change the app directory
if [ -d "air_pressure" ]; then
  echo "Changing directory to air_pressure" >&2
  cd air_pressure || exit 1
fi

# Run the app
echo 'Running the app' >&2
npm start


