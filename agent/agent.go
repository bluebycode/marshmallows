package main

import (
	"fmt"
	"log"
)

func main() {
	token := GenerateToken(6)
	fmt.Println("[agent]token", token)

	createClientChannel("localhost", 9999, "/ws", func(in []byte, size int) []byte {
		log.Println("pipe received", in, size)
		return in
	})
	/*
		// authorisation channel
		shutdown := make(chan bool)
		done := make(chan struct{})
		conn := authConnection("localhost", 8081, "/open/"+token) // @todo: ride off placeholder
		defer conn.Close()
		go func() {
			defer close(done)
			authHandler(token, conn, shutdown)
		}()

		// builds an interval signal used as Hearbeat
		healthcheck := time.NewTicker(10 * time.Second)
		defer healthcheck.Stop()

		for {
			select {
			case <-shutdown:
				log.Println("[agent] closing...")
				return
			case timestamp := <-healthcheck.C:
				healthcheckHandler(conn, timestamp)
			}
		}*/
}
