package main

import (
	"log"
	"net/http"

	_ "websocket"

	"github.com/gorilla/websocket"
)

// createChannel ... create channel and attach I/O on channel
func createChannel(channelID string, port int, finished chan bool,
	incoming *chan []byte, outgoing *chan []byte, cin *chan []byte, cout *chan []byte) {
	log.Println("Creating channel ", channelID, "port:", port)

	channelMux := http.NewServeMux()
	channelMux.HandleFunc("/ws", wsChannelHandler(channelID, incoming, outgoing, cin, cout))
	go createServerChannel("localhost", port, channelMux) //@todo: add security and non placeholders addresses
	finished <- true
}

// wsChannelHandler ... receives and handle incoming websockets connections, assign them into channel hub
func wsChannelHandler(channelID string, incoming *chan []byte, outgoing *chan []byte, cin *chan []byte, cout *chan []byte) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		upgrader.CheckOrigin = func(r *http.Request) bool { return true }
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("upgrade:", err)
			return
		}
		h := newChannelHub(*incoming, *outgoing, *cin, *cout)
		handlerSecureChannel(channelID, ws, h)
	}
}

func handlerSecureChannel(channelID string, c *websocket.Conn, h *channelHub) {
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
