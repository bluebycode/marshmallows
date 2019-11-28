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

// createServerChannel ... create a WS channel from server side
// DEVELOPED BEFORE COMPETITION
func createServerChannel(address string, port int, channelMux *http.ServeMux) {
	listener, err := net.Listen("tcp", ":"+strconv.FormatInt(int64(port), 10))
	if err != nil {
		fmt.Println("Error listening:", err)
		os.Exit(1)
	}
	if err := http.Serve(listener, channelMux); err != nil {
		log.Fatal(err)
	}
}

// createClientChannel ... create a WS channel from client side
// DEVELOPED BEFORE COMPETITION
func createClientChannel(address string, port int, path string) {
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

	wc := &ReadWriteConnector{c: c}

	p := &Pipe{
		r: wc,
		w: wc,
		f: func(in []byte, size int) []byte {
			// @todo: returns message
			return in
		}}
	go p.attach(done)

	for {
		select {
		case <-done:
			fmt.Println("Finished")
			return
		}
	}
}
