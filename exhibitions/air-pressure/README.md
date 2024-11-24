# Air Pressure Exhibit
This exhibit demonstrates the relationship between air pressure and energy.
The exhibit consists of a pump that pumps air into a bottle and a pressure
sensor that measures the air pressure inside the bottle. The data is sent
to a locally hosted website using a WebSocket server. The website displays
the air pressure in the bottle and the potential energy stored in the bottle.

## Installation
Change to this directory:
```bash
cd energy-exhibition/air_pressure
```

Run the `on_startup.sh` script to install the required packages and start 
docker containers that run both the WebSocket server and the website.

```bash
./on_startup.sh
```

If you get a permission denied error, you may need to give execute permissions
to the script:

```bash
chmod +x on_startup.sh
```

If you ran the `on_startup.sh` script, the website should be running on
[http://localhost:3000](). 

## Usage
### Running the Website Manually (no Docker)
If you want to run the website manually, you can
run the following commands:

```bash
cd energy-exhibition/air_pressure
npm start
```

If you don't have npm installed, you can install it using the following command:

```bash
sudo apt install npm
```

### Running the Website in Docker
Make sure you have Docker and Docker Compose installed. If you don't, you can
install them using the following commands:

```bash
sudo apt install docker.io
sudo apt install docker-compose
```

Then you can run the following command to start the website in a Docker container:

```bash
cd energy-exhibition
docker-compose up -d air-pressure
```

if you want to run the serial to websocket forwarder too, you can just run:

```bash
docker-compose up -d
```

Open a web browser and navigate to [http://localhost:3000]() to view the website.
