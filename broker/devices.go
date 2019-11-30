package main

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"time"
)

// Generate ID
func generateId() string {
	var charset = "0123456789abcdef"
	var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))
	var length = 8
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

// Device ... representation of registered devices
type Device struct {
	Token     string `json:"token"`
	Timestamp int64  `json:"update"`
}

type Node struct {
	Id    string `json:"id"`
	Group int    `json:"group"`
}

type Link struct {
	Source string `json:"source"`
	Target string `json:"target"`
}

type NodeLinks struct {
	Nodes []Node `json:"nodes"`
	Links []Link `json:"links"`
}

// httpDevicesHandler ... retrieve all devices connected
func httpDevicesHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	links := make([]Link, 0, len(devices))
	nodes := make([]Node, 0, len(devices)+1)
	nodes = append(nodes, Node{Id: cloudID, Group: 1})
	for _, device := range devices {
		nodes = append(nodes, Node{Id: device.Token, Group: 2})
		links = append(links, Link{Source: device.Token, Target: cloudID})
	}
	all := NodeLinks{Nodes: nodes, Links: links}
	json.NewEncoder(w).Encode(all)
}
