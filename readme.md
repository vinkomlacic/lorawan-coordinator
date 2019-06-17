# LoraWAN Coordinator
Coordinates sleep and transmission times for nodes in a sensor network through [The Things Network][ttn] API.

## Install and run with Docker
1. Place docker-compose file in some folder.
2. Run `docker-compose up --no-start` to create services.
3. Run `docker-compose run lorawan_coordinator` to run application.
4. Stop application with typing exit and destroy docker fixture with `docker-compose down`

[ttn]: https://www.thethingsnetwork.org