
# Broker

```
./broker \
  -id "valc31"
  -agentsPort 8888 -brokerPort 9999 \
  -authApiAddress "https://192.168.43.104:3000/agent_registration/check"  \
  -hostname "localhost"  \
  -configuration configuration.prod.conf
```



## Interaction

![](https://github.com/vrandkode/marshmallows/raw/master/docs/diagramas/diagrama_agent.jpg)
![](https://github.com/vrandkode/marshmallows/raw/master/docs/diagramas/e2e.jpg)

## Endpoints

* Agents 
  * Registration [WS] http://localhost:8081/open/{a2d1}
  * Retrieval [Http] http://localhost:8081/devices
* Channels
  * Channels creation tool [Http] Admin endpoint to create channels: http://localhost:8081/admin/channel/create/channel12/9999

## Tecnologias

* Websockets (github.com/gorilla/websocket)
* HTTP router and URL (github.com/gorilla/mux)

## Referencias
