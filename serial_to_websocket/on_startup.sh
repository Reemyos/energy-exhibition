# Make sure poetry is installed and if not install it
if ! [ -x "$(command -v poetry)" ]; then
  echo 'Poetry is not installed. Installing now...' >&2
  curl -sSL https://install.python-poetry.org | python3
  echo 'Installed poetry' >&2
else
  echo 'Poetry is already installed' >&2
fi

# Make sure the current working directory is where this script is located
cd '/home/mada/energy-exhibition/serial_to_websocket'
echo "Current directory: $(pwd)"

# Install the dependencies
echo 'Installing dependencies' >&2
poetry install
echo 'Installed dependencies' >&2

script_path='serial_to_websocket.py'

# If cwd is energy-exhibition and not serial_to_websocket define the script path as:
if [ -d "serial_to_websocket" ]; then
  script_path='./serial_to_websocket/serial_to_websocket.py'
fi

# Run the script
echo 'Running the script' >&2
poetry run python3 $script_path
