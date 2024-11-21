# Run the serial_to_websocket/on_startup.sh script in a subshell
eval "sh ./serial_to_websocket/on_startup.sh" &> /dev/null & disown

# Run the air_pressure/on_startup.sh script
sh ./air_pressure/on_startup.sh


