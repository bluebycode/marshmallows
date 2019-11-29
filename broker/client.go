package main

import (
	"log"

	"github.com/gorilla/websocket"
)

// Client wrapper of a websocket connection associated to
// one client connections from hosts under registration
type Client struct {
	*Peer
	token     string
	sid       int32
	timestamp int64
}

// Session ...structure contains information user-device session
type Session struct {
	token string
	sid   int32
	peer  *Client
}

func (client *Client) close() {

	// Close the current connection
	client.Peer.close()

	// Disconnects peer from peers pool
	// ...
}

func (client *Client) read() {
	defer client.close()

	for {
		messageType, p, err := client.conn.ReadMessage()
		if err != nil {
			log.Println(err)
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("[peer::client] eror: %v", err)
			}
			break
		}

		// Reading the message from peer
		log.Println("[peer::client] Reading", messageType, p)
		msg := &Message{messageType, p, client.Peer, client.sid}

		select {
		case client.hub.usersIncoming <- msg:
			log.Println("[peer::client] Incoming message to hub", msg)
		}
	}
}
