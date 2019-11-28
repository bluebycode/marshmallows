package main

import "github.com/gorilla/websocket"

// Buffer definitions
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}
