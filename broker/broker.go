package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
	_ "websocket"

	"github.com/gorilla/mux"
)

func wsPeersHandler(hub *Hub) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		token := mux.Vars(r)["token"]

		log.Println("[hub] Register request from device '", token)

		upgrader.CheckOrigin = func(r *http.Request) bool { return true }

		// Peer representation of connection
		ws, _ := upgrader.Upgrade(w, r, nil)
		peer := &Peer{
			hub:  hub,
			conn: ws,
			send: make(chan []byte, 1024)}

		// Sending the registration into hub connections
		timestamp := time.Now().Unix()

		// Wrap the peer as agent
		// @todo: we should do the same with clients
		agent := &Agent{peer, token, timestamp}
		go agent.read()
		hub.register <- agent
	}
}

// httpDevicesHandler ... retrieve all devices connected
func httpDevicesHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(devices)
}

// Devices pool
var devices = make(map[string]*Device, 1000)

// ChannelIO
var channels = make(map[int]channelIO)
var releases = make(map[int]chan bool)

func main() {

	hub := newMainHub(&devices)
	go hub.Start()

	port := 8081

	// routes
	router := mux.NewRouter()

	///////////
	// workbench endpoints
	var cin = make(chan []byte, 1)
	var cout = make(chan []byte, 1)
	var incoming = make(chan []byte, 1)
	var outgoing = make(chan []byte, 1)
	router.HandleFunc("/admin/channel/create/{channel}/{port}",
		wsAdminCreateChannelHandler(&incoming, &outgoing, &cin, &cout)).Methods("GET")
	///////////

	// devices available
	router.HandleFunc("/devices",
		httpDevicesHandler).Methods("GET")

	// peers (devices and client) registration
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
