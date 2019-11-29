package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"
	"websocket"

	"github.com/flynn/noise"
	"gopkg.in/noisesocket.v0"
)

type rwHandler func(*websocket.Conn)

// createServerPlainChannel ... create a WS channel from server side
func createServerPlainChannel(address string, port int, channelMux *http.ServeMux) {
	listener, err := net.Listen("tcp", ":"+strconv.FormatInt(int64(port), 10))
	if err != nil {
		fmt.Println("Error listening:", err)
		os.Exit(1)
	}
	if err := http.Serve(listener, channelMux); err != nil {
		log.Fatal(err)
	}
}

// createServerNoiseChannel ... create a WS channel from server side
func createServerNoiseChannel(address string, port int, channelMux *http.ServeMux) {

	listener, err := noisesocket.Listen(":"+strconv.FormatInt(int64(port), 10),
		&noisesocket.ConnectionConfig{StaticKey: generateServerKeys(false)})
	if err != nil {
		fmt.Println("Error listening:", err)
		os.Exit(1)
	}

	if err := http.Serve(listener, channelMux); err != nil {
		log.Fatal(err)
	}
}

func generateClientKeys(randomise bool) noise.DHKey {
	if randomise {
		key, _ := noise.DH25519.GenerateKeypair(rand.Reader)
		return key
	}
	pub, _ := base64.StdEncoding.DecodeString("L9Xm5qy17ZZ6rBMd1Dsn5iZOyS7vUVhYK+zby1nJPEE=")
	priv, _ := base64.StdEncoding.DecodeString("TPmwb3vTEgrA3oq6PoGEzH5hT91IDXGC9qEMc8ksRiw=")
	return noise.DHKey{
		Public:  pub,
		Private: priv,
	}
}

func generateServerKeys(randomise bool) noise.DHKey {
	if randomise {
		key, _ := noise.DH25519.GenerateKeypair(rand.Reader)
		return key
	}

	pub, _ := base64.StdEncoding.DecodeString("J6TRfRXR5skWt6w5cFyaBxX8LPeIVxboZTLXTMhk4HM=")
	priv, _ := base64.StdEncoding.DecodeString("vFilCT/FcyeShgbpTUrpru9n5yzZey8yfhsAx6DeL80=")
	return noise.DHKey{
		Public:  pub,
		Private: priv,
	}
}

// createClientNoiseChannel ... create a WS channel from client side
func createClientNoiseChannel(address string, port int, path string, callback func(in []byte, size int) []byte,
	handleReadWrite rwHandler) {

	u := url.URL{Scheme: "ws", Host: address + ":" + strconv.FormatInt(int64(port), 10), Path: "/ws"}
	log.Printf("connecting to %s", u.String())

	// Websockets wrap a noise socket connection
	d := &websocket.Dialer{
		Proxy:            http.ProxyFromEnvironment,
		HandshakeTimeout: 45 * time.Second,
		NetDial: func(network, addr string) (net.Conn, error) {
			conn, err := noisesocket.Dial(addr, &noisesocket.ConnectionConfig{StaticKey: generateClientKeys(false)})
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

// createClientPlainChannel ... create a WS channel from client side
func createClientPlainChannel(address string, port int, path string, callback func(in []byte, size int) []byte,
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
