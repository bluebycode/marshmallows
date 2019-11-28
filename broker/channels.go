package main

import (
	"log"
	"time"
)

// createChannel ... create channel and attach I/O on channel
func createChannel(channelID string, port int, finished chan bool,
	incoming *chan []byte, outgoing *chan []byte, cin *chan []byte, cout *chan []byte) {
	log.Println("Creating channel ", channelID, "port:", port)
	time.Sleep(3000 * time.Millisecond)
	finished <- true
}
