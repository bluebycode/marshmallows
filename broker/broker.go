package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
	_ "websocket"

	"github.com/gorilla/mux"
)

type AgentRegistered struct {
	Token     string `json:"agent token"`
	Timestamp string `json:"agent creation"`
}

func wsPeersHandler(hub *Hub) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		token := mux.Vars(r)["token"]

		log.Println("[hub] Register request from client '", token)

		upgrader.CheckOrigin = func(r *http.Request) bool { return true }

		// Peer representation of connection
		ws, _ := upgrader.Upgrade(w, r, nil)
		peer := &Peer{
			hub:  hub,
			conn: ws,
			send: make(chan []byte, 1024)}

		// Sending the registration into hub connections
		timestamp := time.Now().Unix()

		// Wrap the peer user
		client := &Client{peer, token, int32(0), timestamp}
		go client.read()
		hub.sessions <- client
	}
}

var cloudID = generateId()

// Devices pool
var devices = make(map[string]*Device, 1000)

// ChannelIO
var channels = make(map[int]channelIO)
var releases = make(map[int]chan bool)

func listenBroker(port int, hub *Hub) {

	// routes
	router := mux.NewRouter()

	/////////////////////////////////////////////////////////////////////////////
	// workbench endpoints
	// example: http://localhost:8081/admin/channel/create/aaaa/9999
	// Waiting for connections :8081
	// channels: map[1:{1 0xc0000ae720 0xc0000ae780 0xc0000ae7e0 0xc0000ae840 0xc00013c070}] {1 0xc0000ae720 0xc0000ae780 0xc0000ae7e0 0xc0000ae840 0xc00013c070}
	// 2019/11/29 00:54:08 Creating channel  aaaa port: 9999
	//
	// lsof -iTCP -P|grep 70169
	// b         70169 vrandkode    3u  IPv6 0xa9d15b5d3f54c357      0t0  TCP *:8081 (LISTEN)
	// b         70169 vrandkode    6u  IPv6 0xa9d15b5d3f54bd97      0t0  TCP localhost:8081->localhost:62279 (ESTABLISHED)
	// b         70169 vrandkode    7u  IPv6 0xa9d15b5d3f549b17      0t0  TCP *:9999 (LISTEN) <-----
	router.HandleFunc("/admin/channel/create/{channel}/{port}",
		wsAdminCreateChannelHandler).Methods("GET")
	/////////////////////////////////////////////////////////////////////////////

	// devices available
	router.HandleFunc("/devices.json",
		httpDevicesHandler).Methods("GET")

	// users
	/*router.HandleFunc("/open/{token}",
	httpPeersHandler(hub)).Methods("GET")*/
	router.HandleFunc("/open/{token}",
		wsPeersHandler(hub))

	// an e2e connection
	router.HandleFunc("/channel/{token}/ws",
		wsChannelHandler)

	// server
	http.Handle("/", router)
	fmt.Println("Waiting for connections :" + strconv.Itoa(port))
	err := http.ListenAndServe(":"+strconv.Itoa(port), nil)
	if err != nil {
		log.Fatal("[main] ListenAndServe: ", err)
	}
}

// ./broker \
//		-agentsPort 8888 -brokerPort 9999 \
// 		-authApiAddress "https://192.168.43.104:3000/agent_registration/check"
//      -hostname "localhost"

var authApiAddress string
var brokerHostname string

func main() {
	var agents = flag.Int("agentsPort", 8082, "default port listener - agent noise broker")
	var broker = flag.Int("brokerPort", 8081, "default port listener - main broker")
	flag.StringVar(&authApiAddress, "authApiAddress", "https://auth.marshmallows.cloud", "authAddress")
	flag.StringVar(&brokerHostname, "hostname", "127.0.0.1", "authAddress")
	flag.Parse()

	hub := newMainHub(&devices)
	go hub.Start()

	go listenAgents(*agents, hub)
	listenBroker(*broker, hub)
}
