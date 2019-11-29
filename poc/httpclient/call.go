package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

func main() {
	c := make(chan bool)
	go authTokenValidation("192.168.43.104", 3000, "/agent_registration/check", "FABADA", c)
	for {
		select {

		case <-c:
			return
		}
	}
}

func authTokenValidation(address string, port int, path string, secretToken string, c chan bool) {

	message := map[string]interface{}{
		"token": secretToken,
	}

	bytesRepresentation, err := json.Marshal(message)
	if err != nil {
		log.Fatalln(err)
	}

	resp, err := http.Post("http://"+address+":"+strconv.Itoa(port)+path, "application/json", bytes.NewBuffer(bytesRepresentation))
	if err != nil {
		log.Fatalln(err)
	}

	var response map[string]interface{}

	json.NewDecoder(resp.Body).Decode(&response)
	log.Println(response)
	log.Println(response["status"])
	c <- true
}
