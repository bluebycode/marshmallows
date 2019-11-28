package main

// @vrandkode
// Developed before competition.
// This file contains handlers and patterns functionality helpers with Websockets.

import (
	"log"

	"github.com/gorilla/websocket"
)

// Buffer definitions
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func handleConnection(connection *websocket.Conn, messageType int, packet []byte) {
	// ...
}

func wsHandler(connection *websocket.Conn, shutdown chan bool) {
	for {
		messageType, data, err := connection.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		handleConnection(connection, messageType, data)
	}
}
