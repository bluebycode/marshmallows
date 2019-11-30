package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"sync/atomic"
	"time"

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
		log.Println("[hub] Agent already registered")
		return
	}

	// Ask for authorisation
	c := make(chan bool)
	go authTokenValidation(authApiAddress+"/agent_registration/check", agent.secretToken, c,
		func() {
			// Registration if agent is allowed
			log.Println("[hub] Agent has been registered")
			hub.agents[agent.token] = agent

			// Update the devices pool with the latest information
			// from already registered device
			hub.devices[agent.token] = &Device{
				Token:     agent.token,
				Timestamp: time.Now().Unix(),
			}
		})
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
			handleIncomingMessages(hub, msg)
		}
	}
}

func handleIncomingMessages(hub *Hub, message *Message) {
	ack := &TRequest{}
	fmt.Println("[hub->user] Handle message", message.data, string(message.data))
	if message.messageType == websocket.BinaryMessage {
		fmt.Println("[hub->user] not a text message")
		return
	}

	var req TRequest
	json.Unmarshal([]byte(string(message.data)), &req)
	fmt.Println(req)
	switch req.Type {
	case "auth":

		// Client should not send authentication if session was not longer stablished
		_sid := message.sid
		if _sid == 0 {
			ack.Type = "auth"
			ack.Data = map[string]interface{}{
				"message": "client lost the session information",
			}
			data, _ := json.Marshal(ack)
			message.peer.conn.WriteMessage(websocket.TextMessage, data)
			return
		}

		// Send authentication data to the system's agent
		// with static public key from client stored on session.
		// Extra authentication also is sent in order to establish access control feature.
		session, _ := hub.sids[_sid]
		if _, ok := hub.agents[session.token]; ok {
			authData := req.Data["authdata"].(string)
			log.Println("[hub::user] Authentication with authdata", authData)

			// @todo: worst access control logic ever :(
			if authData == "not_authorised_user" {
				ack.Type = "auth"
				ack.Data = map[string]interface{}{
					"error": "not authorised",
				}
				data, _ := json.Marshal(ack)
				message.peer.conn.WriteMessage(websocket.TextMessage, data)
				return
			}

			sid := int(_sid)
			channelID := session.token
			port := 7000 + sid // @todo: replace with a discovery solution

			// Let's create the channel
			// @todo: add a way to provide sessions and sid
			sources["127.0.0.1"] = int(sid)
			cio := newChannelIO(int(sid))
			channels[sid] = *cio

			// Add a session before channel creation
			sessions[session.token] = &ChannelSession{
				sid:        1,
				deviceID:   channelID,
				publicKey:  "",
				targetIP:   brokerHostname,
				targetPort: port,
			}

			// create common hub
			fmt.Println("dedicated channels:", channels, "IO:", *cio, "sources", sources)

			// @todo Add channel before
			var finished = make(chan bool)
			finishedChannels[channelID] = finished

			// create the server channel listening from agent
			go createChannel(channelID, port, finished, *cio)

			// Sending the ack
			ack.Type = "auth"
			ack.Data = map[string]interface{}{
				"ack": "ok",
			}
			data, _ := json.Marshal(ack)
			message.peer.conn.WriteMessage(websocket.TextMessage, data)
		}
	}
}
