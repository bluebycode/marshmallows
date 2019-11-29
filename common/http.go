package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
)

// References: http://polyglot.ninja/golang-making-http-requests/

/*
c := make(chan bool)
	go authTokenValidation("192.168.43.104", 3000, "/agent_registration/check", "FABADA", c)
	for {
		select {

		case <-c:
			return
		}
	}*/

func authTokenValidation(address string, secretToken string, c chan bool, success func()) {
	message := map[string]interface{}{
		"token": secretToken,
	}
	bytesRepresentation, err := json.Marshal(message)
	if err != nil {
		log.Fatalln(err)
	}
	resp, err := http.Post(address, "application/json", bytes.NewBuffer(bytesRepresentation))
	if err != nil {
		log.Fatalln(err)
	}
	var response map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&response)
	log.Println(response)
	log.Println(response["status"])
	if response["status"] == "ok" {
		success()
	}
	c <- true
}
