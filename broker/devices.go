package main

// Device ... representation of registered devices
type Device struct {
	Token     string `json:"token"`
	Timestamp int64  `json:"update"`
}
