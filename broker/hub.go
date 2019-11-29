package main

import (
	"encoding/json"
	"log"
	"strconv"
	"sync/atomic"

	"github.com/gorilla/websocket"
)

// TRequest interface of general messaging
type TRequest struct {
	Type string
	Data map[string]interface{}
}

// Message ... Common scheme of a message handled by the hub
type Message struct {
	messageType int
	data        []byte
	peer        *Peer
	sid         int32 `default0:0` // sid. session identifier
}

// Hub .... A representative structure communication component.
// It handles all incoming/outgoing message from peers: agents or clients.
type Hub struct {
	agents         map[string]*Agent
	agentsIncoming chan *Message
	usersIncoming  chan *Message
	register       chan *Agent
	unregister     chan *Agent
	sessions       chan *Client
	devices        map[string]*Device
	sids           map[int32]*Session
}

func newMainHub(devices *map[string]*Device) *Hub {
	return &Hub{
		agents:         make(map[string]*Agent),
		agentsIncoming: make(chan *Message, 1000),
		usersIncoming:  make(chan *Message, 1000),
		register:       make(chan *Agent, 100),
		unregister:     make(chan *Agent, 100),
		sessions:       make(chan *Client, 100),
		devices:        *devices,
		sids:           make(map[int32]*Session),
	}
}

// sessions counter
var _sid = int32(0)

func handleSession(hub *Hub, client *Client) {
	ack := &TRequest{Type: "auth"}

	// Check if device token is still available
	if _, ok := hub.agents[client.token]; ok {
		sid := atomic.AddInt32(&_sid, 1)
		log.Printf("[hub] Session created, sid: %d\n", sid)
		client.sid = sid // @todo: it should be mapped in case client is connected to multiple devices (same with tokens)
		hub.sids[sid] = &Session{token: client.token, sid: sid, peer: client}

		// Client session has been created
		ack.Data = map[string]interface{}{
			"sid": strconv.FormatInt(int64(sid), 10), // int32->string
		}
	}
	data, _ := json.Marshal(ack)
	client.Peer.conn.WriteMessage(websocket.TextMessage, data)
}

func handleAgentRegistration(hub *Hub, agent *Agent) {
	if _, ok := hub.agents[agent.token]; ok {
		log.Println("[hub] Agent already registered") //@todo close?
	} else {

		// make authentication
		go authTokenValidation(authApiAddress, agent.secretToken, c, func() {
			// Registration
			hub.agents[agent.token] = agent
			log.Println("[hub] Agent under registration:", agent.token)

			// Update the devices pool
			hub.devices[agent.token] = &Device{
				Token:     agent.token,
				Timestamp: "", //@todo: please fix this
			}
		})
	}
}

// Start .. performs the subscription to receive and sending connections
func (hub *Hub) Start() {
	for {
		select {

		case agent := <-hub.register:
			// Agent registration
			handleAgentRegistration(hub, agent)

		case agent := <-hub.unregister:
			// Agent unregistration
			// ..
			log.Println("[hub] Agent unregistered", agent)

		case msg := <-hub.agentsIncoming:
			// Messages outgoing to Agent (binary layout)
			// - Check if agent was already registered
			log.Println("[hub->agent] Incoming message to agent", msg)

		case client := <-hub.sessions:
			// Client registration (session)
			handleSession(hub, client)

		case msg := <-hub.usersIncoming:
			// Messages outgoing to users (text layout)
			// - Check if users was already registered
			log.Println("[hub->user] Incoming message to user", msg)
		}
	}
}
