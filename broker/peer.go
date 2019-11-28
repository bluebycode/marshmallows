package main

import (
	"github.com/gorilla/websocket"
)

// Peer ... A peer/connection representation. A websocket wrapper to connection.
type Peer struct {
	hub  *Hub
	conn *websocket.Conn
	send chan []byte
}

func (p *Peer) close() {
	p.conn.Close()
}
