package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "websocket"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type channelIO struct {
	sid      int
	cin      chan []byte
	cout     chan []byte
	incoming chan []byte
	outgoing chan []byte
	release  chan bool
}

func newChannelIO(sid int) *channelIO {
	return &channelIO{
		sid:      sid,
		cin:      make(chan []byte, 1),
		cout:     make(chan []byte, 1),
		incoming: make(chan []byte, 1),
		outgoing: make(chan []byte, 1),
		release:  make(chan bool, 1)}
}

// sources
var sources = make(map[string]int)

// finished channels
var finishedChannels = make(map[string]chan bool)

// createChannel ... create channel and attach I/O on channel
func createChannel(channelID string, port int, finished chan bool,
	cio channelIO) {
	log.Println("Creating channel ", channelID, "port:", port)

	channelMux := http.NewServeMux()
	channelMux.HandleFunc("/ws", wsAdminChannelHandler(channelID, &cio.incoming, &cio.outgoing, &cio.cin, &cio.cout))
	// @todo replace with createServerNoiseChannel("localhost", port, channelMux)
	createServerPlainChannel("localhost", port, channelMux) //@todo: add security and non placeholders addresses
	finished <- true
}

// wsAdminCreateChannelHandler ... handles the admin endpoint to create channel
func wsAdminCreateChannelHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	channelID := params["channel"]
	port := params["port"]

	// @todo: add a way to provide sessions and sid
	sid := 1
	sources["127.0.0.1"] = sid
	cio := newChannelIO(sid)
	channels[sid] = *cio

	// Add a session before channel creation
	sessions[channelID] = &ChannelSession{
		sid:        1,
		deviceID:   channelID,
		publicKey:  "",
		targetIP:   "127.0.0.1",
		targetPort: Str2int(port),
	}

	// create common hub
	fmt.Println("admin channels:", channels, "IO:", *cio, "sources", sources)

	// @todo Add channel before
	var finished = make(chan bool)
	finishedChannels[channelID] = finished

	// create the server channel listening from agent
	go createChannel(channelID, Str2int(port), finished, *cio)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(channelID)
}

// wsAdminChannelHandler ... receives and handle incoming websockets connections, assign them into channel hub
func wsAdminChannelHandler(channelID string, incoming *chan []byte, outgoing *chan []byte, cin *chan []byte, cout *chan []byte) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		upgrader.CheckOrigin = func(r *http.Request) bool { return true }
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("upgrade:", err)
			return
		}
		h := newChannelHub(*incoming, *outgoing, *cin, *cout)
		handlerAdminSecureChannel(channelID, ws, h)
	}
}

func handlerAdminSecureChannel(channelID string, c *websocket.Conn, h *channelHub) {
	go h.run()
	h.newConnection <- c
	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Println("[channel] error:", err)
			break
		}
		log.Println("[channel] message:", message)
		h.outgoing <- message
	}
}

func wsChannelHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	channelID := params["channel"]

	//@todo replace with a real source using X-Forward-IP ?¿
	source := "127.0.0.1"

	// check upgrader
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("upgrade:", err)
		return
	}
	fmt.Println("session:", channelID)

	// create pipeline attached to session
	sid := sources[source]
	//cio := newChannelIO(sid)
	cio := channels[sid]

	// create common hub
	fmt.Println("channels:", channels, "IO:", cio, "sources", sources)
	hub := newChannelHub(cio.incoming, cio.outgoing, cio.cin, cio.cout)
	wsChannelHubHandler(ws, hub) // waiting for messages
	fmt.Println("pass!")
}

func wsChannelHubHandler(c *websocket.Conn, h *channelHub) {
	go h.runCommon()

	fmt.Println("[hub] waiting for connections")
	h.newConnection <- c

	for {
		messageType, message, _ := c.ReadMessage()
		fmt.Println("[hub] read...'", message, string(message), messageType)
		h.commonOutgoing <- message
	}
}
