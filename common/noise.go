package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"
	"websocket"
)

// createServerNoiseChannel ... create a WS channel from server side
func createServerNoiseChannel(address string, port int, channelMux *http.ServeMux) {
	listener, err := net.Listen("tcp", ":"+strconv.FormatInt(int64(port), 10))
	if err != nil {
		fmt.Println("Error listening:", err)
		os.Exit(1)
	}
	if err := http.Serve(listener, channelMux); err != nil {
		log.Fatal(err)
	}
}

type rwHandler func(*websocket.Conn)

// createClientNoiseChannel ... create a WS channel from client side
func createClientNoiseChannel(address string, port int, path string, callback func(in []byte, size int) []byte,
	handleReadWrite rwHandler) {
	u := url.URL{Scheme: "ws", Host: address + ":" + strconv.FormatInt(int64(port), 10), Path: path}
	log.Printf("connecting to %s", u.String())

	d := &websocket.Dialer{
		Proxy:            http.ProxyFromEnvironment,
		HandshakeTimeout: 45 * time.Second,
		NetDial: func(network, addr string) (net.Conn, error) {
			conn, err := net.Dial("tcp", addr)
			if err != nil {
				fmt.Println("Dial", err)
			}
			return conn, err
		},
	}
	c, _, err := d.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer c.Close()

	done := make(chan struct{})

	go func() {
		defer close(done)
		handleReadWrite(c)
	}()
	for {
		select {
		case <-done:
			return
		}
	}
}
