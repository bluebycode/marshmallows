package main

import (
	"log"
	"websocket"
)

// Developed before competition.
// This file contains Hub pattern model

type THub struct {
	client         *websocket.Conn
	newConnection  chan *websocket.Conn
	commonIncoming chan []byte
	commonOutgoing chan []byte
	incoming       chan []byte
	outgoing       chan []byte
}

func (h *THub) run() {
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
			c := h.client
			log.Println("[hub] Incoming message", message)
			err := c.WriteMessage(websocket.BinaryMessage, message)
			if err != nil {
				log.Println("[channels] error:", err)
				break
			}
		case message := <-h.outgoing:
			// Outgoing message
			log.Println("[hub] Outgoing message", message)
			h.commonIncoming <- message
		}
	}
}

func newTHub(incoming chan []byte, outgoing chan []byte, cincoming chan []byte, coutgoing chan []byte) *THub {
	return &THub{
		client:         nil,
		newConnection:  make(chan *websocket.Conn, 1),
		incoming:       incoming,
		outgoing:       outgoing,
		commonIncoming: cincoming,
		commonOutgoing: coutgoing,
	}
}
