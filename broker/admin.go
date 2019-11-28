package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

// finished channels
var finishedChannels = make(map[string]chan bool)

// wsAdminCreateChannelHandler ... handles the admin endpoint to create channel
func wsAdminCreateChannelHandler(incoming *chan []byte, outgoing *chan []byte, cin *chan []byte, cout *chan []byte) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		params := mux.Vars(r)
		channelID := params["channel"]
		port := params["port"]

		// @todo Add channel before
		var finished = make(chan bool)
		finishedChannels[channelID] = finished
		go createChannel(channelID, Str2int(port), finished, incoming, outgoing, cin, cout)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(channelID)
	}
}
