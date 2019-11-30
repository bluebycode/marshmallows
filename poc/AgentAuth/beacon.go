package main

import (
	"log"
	"time"

	"github.com/flynn/noise"
)

// sendBeacon ... sends the authentication request to broker
func sendBeacon(address string, keys *noise.DHKey, deviceID string) {
	sendAuthentication(address, "", keys, deviceID)
}

func handleBeaconRequest(keys *noise.DHKey, deviceID string, timestamp time.Time) {
	log.Println("[auth] Sending beacon, timestamp:", timestamp)
	go sendBeacon(brokerAddress+"/open", keys, deviceID)
}
