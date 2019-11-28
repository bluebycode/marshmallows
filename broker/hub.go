package main

import (
	"log"
)

// Message ... Common scheme of a message handled by the hub
type Message struct {
	messageType int
	data        []byte
	peer        *Peer
	sid         int32 `default0:0` // sid. session identifier
}

// Hub .... A representative structure communication component. It handles all incoming/outgoing message from peers: agents or clients.
type Hub struct {
	agents         map[string]*Agent
	agentsIncoming chan *Message
	usersIncoming  chan *Message
	register       chan *Agent
	unregister     chan *Agent
	sessions       chan *Client
}

func newMainHub() *Hub {
	return &Hub{
		agents:         make(map[string]*Agent),
		agentsIncoming: make(chan *Message, 1000),
		usersIncoming:  make(chan *Message, 1000),
		register:       make(chan *Agent, 100),
		unregister:     make(chan *Agent, 100),
		sessions:       make(chan *Client, 100)}
}

// Start .. performs the subscription to receive and sending connections
func (hub *Hub) Start() {
	for {
		select {

		case agent := <-hub.register:
			// Agent registration
			// ..
			log.Println("[hub] Agent already registered ?", agent)

		case agent := <-hub.unregister:
			// Agent unregistration
			// ..
			log.Println("[hub] Agent unregistered", agent)

		case msg := <-hub.agentsIncoming:
			// Messages outgoing to Agent (binary layout)
			// - Check if agent was already registered

			log.Println("[hub->agent] Incoming message to agent", msg)

		case <-hub.sessions:
			// Client registration (session)
			// ..
			log.Println("[hub<-user] Client already registered ?")

		case msg := <-hub.usersIncoming:
			// Messages outgoing to users (text layout)
			// - Check if users was already registered
			log.Println("[hub->user] Incoming message to user", msg)
		}
	}
}
