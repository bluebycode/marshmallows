package main

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

// channelHub .... A representative structure communication dedicated for channels.
type channelHub struct {
	client         *websocket.Conn
	newConnection  chan *websocket.Conn
	commonIncoming chan []byte
	commonOutgoing chan []byte
	incoming       chan []byte
	outgoing       chan []byte
}

// Start .. performs the subscription to receive and sending connections
func (h *channelHub) run() {
	for {
		select {
		case conn := <-h.newConnection:
			// Registers the connection
			// ..
			log.Println("[channels] Incoming connection")
			h.client = conn
		case message := <-h.incoming:
			// Incoming message
			// ..
			log.Println("[channels] Incoming message", message)
			c := h.client
			err := c.WriteMessage(websocket.BinaryMessage, message)
			if err != nil {
				log.Println("[channels] error:", err)
				break
			}
		case message := <-h.outgoing:
			// Outgoing message
			log.Println("[channels] Outgoing message", message)
			h.commonIncoming <- message
		}
	}
}

func newChannelHub(incoming chan []byte, outgoing chan []byte, cincoming chan []byte, coutgoing chan []byte) *channelHub {
	fmt.Println("channel hub -> channel address", incoming)
	fmt.Printf("cin %v", cincoming)
	fmt.Printf("cin %v", coutgoing)
	fmt.Printf("in %v", incoming)
	fmt.Printf("out %v", outgoing)
	return &channelHub{
		client:         nil,
		newConnection:  make(chan *websocket.Conn, 1),
		incoming:       incoming,
		outgoing:       outgoing,
		commonIncoming: cincoming,
		commonOutgoing: coutgoing,
	}
}
