package main

import (
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

var sources = make(map[string]int)

// createChannel ... create channel and attach I/O on channel
func createChannel(channelID string, port int, finished chan bool,
	incoming *chan []byte, outgoing *chan []byte, cin *chan []byte, cout *chan []byte) {
	log.Println("Creating channel ", channelID, "port:", port)

	channelMux := http.NewServeMux()
	channelMux.HandleFunc("/ws", wsAdminChannelHandler(channelID, incoming, outgoing, cin, cout))
	go createServerChannel("localhost", port, channelMux) //@todo: add security and non placeholders addresses
	finished <- true
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
	c := newChannelIO(sid)
	channels[sid] = *c

	// create common hub
	fmt.Println("channels:", channels, *c)
	hub := newChannelHub(c.incoming, c.outgoing, c.cin, c.cout)
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
