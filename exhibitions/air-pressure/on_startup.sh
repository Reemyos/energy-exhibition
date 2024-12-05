#!/bin/bash

# Make sure npm is installed and if not install it
if ! [ -x "$(command -v npm)" ]; then
  echo 'npm is not installed. Installing now...' >&2
  # installs nvm (Node Version Manager)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
  # download and install Node.js (you may need to restart the terminal)
  nvm install 22
  # verifies the right Node.js version is in the environment
  node -v # should print `v22.11.0`
  # verifies the right npm version is in the environment
  npm -v # should print `10.9.0`
  mkdir ~/.npm-packages
  npm config set prefix ~/.npm-packages
  echo 'Installed npm' >&2
else
  echo 'npm is already installed' >&2
fi

cd '/home/mada/energy-exhibition/exhibitions/air-pressure'

# Install the dependencies
echo 'Installing dependencies' >&2
npm install

echo 'Running the app' >&2
BROWSER=none npm start &

# Wait for a few seconds to ensure the app has started
sleep 5

# Open Firefox in fullscreen mode (kiosk mode) and point to the app's URL
echo 'Opening Firefox in fullscreen mode' >&2
firefox --kiosk http://localhost:3000 


