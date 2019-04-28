# LoraWAN Coordinator
Coordinates sleep and transmission times for nodes in a sensor network through [The Things Network][ttn] API.

### Requirements
In this section requirements will be set. Remove this after completing.

#### Data
**Database**: MySql
**Tables** (without relations): schedule, node, config_params
**Relations**: schedule_node (2 to many)

#### Code components
1. Database models
2. TTN callback functions for events (uplink, activation, ...)
3. Service methods for calculating next schedule for a given node.



[The Things Network]: https://www.thethingsnetwork.org