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

var devices = make(map[string]*Device, 1000)

func main() {

	hub := newMainHub(&devices)
	go hub.Start()

	port := 8081

	// routes
	router := mux.NewRouter()

	// devices available
	router.HandleFunc("/devices",
		httpDevicesHandler).Methods("GET")

	// peers (devices and client) registration
	router.HandleFunc("/open/{token}",
		wsPeersHandler(hub))

	// server
	http.Handle("/", router)
	fmt.Println("Waiting for connections :" + strconv.Itoa(port))
	err := http.ListenAndServe(":"+strconv.Itoa(port), nil)
	if err != nil {
		log.Fatal("[main] ListenAndServe: ", err)
	}
}
