package main

import (
	"log"

	"github.com/gorilla/websocket"
)

type Agent struct {
	*Peer
	token     string
	timestamp int64
}

func (agent *Agent) close() {
	// Closing the peer
}

func (agent *Agent) read() {
	defer agent.close()

	for {
		messageType, p, err := agent.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("[peer::agent] Error: %v", err)
			}
			break
		}

		// Reading the message from peer
		log.Println("[peer::agent] Reading", messageType, p)
		msg := &Message{messageType, p, agent.Peer, int32(0)}

		select {
		case agent.hub.agentsIncoming <- msg:
			// Forward message to hub dedicated topic
			// ...
			log.Println("[peer::agent] Incoming message to hub", msg)
		}
	}
}
