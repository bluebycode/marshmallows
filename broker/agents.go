package main

import (
	"log"
	"net/http"
	"strconv"

	"os"

	"fmt"

	"io/ioutil"

	requests "./protocol"
	"github.com/golang/protobuf/proto"
	"gopkg.in/noisesocket.v0"
)

func serverHandler(hub *Hub) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			return
		}
		auth := &requests.AgentAuth{}
		err = proto.Unmarshal(body, auth)
		if err != nil {
			log.Fatal("unmarshaling error: ", err)
		}
		fmt.Println("RESPONSE", body, auth.GetToken(), auth.GetPublicKey(), auth.GetDeviceId())

		hub.register <- &Agent{
			token:       auth.GetDeviceId(),
			publicKey:   auth.GetPublicKey(),
			secretToken: auth.GetToken(),
		}
	}
}

func listen(address string, port int, path string, hub *Hub) {
	l, err := noisesocket.Listen(":"+strconv.Itoa(port), &noisesocket.ConnectionConfig{StaticKey: generateKeys()})
	if err != nil {
		fmt.Println("Error listening:", err)
		os.Exit(1)
	}

	mux := http.NewServeMux()
	mux.HandleFunc(path, serverHandler(hub))
	fmt.Println("Listening agents on port", port, "...")
	if err := http.Serve(l, mux); err != nil {
		panic(err)
	}
}

func listenAgents(port int, hub *Hub) {
	listen("localhost", port, "/open", hub)
}
