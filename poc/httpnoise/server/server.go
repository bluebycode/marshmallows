package main

import (
	"log"
	"net/http"
	"strconv"

	"os"

	"fmt"

	"encoding/base64"

	"io/ioutil"

	requests "./protocol"
	"github.com/flynn/noise"
	"github.com/golang/protobuf/proto"
	"gopkg.in/noisesocket.v0"
)

func main() {
	startServer("localhost", 7777, "/open")
}

func serverHandler() func(w http.ResponseWriter, r *http.Request) {
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
	}
}

func startServer(address string, port int, path string) {

	// NOTE: BE AWARE ABOUT HARDCODED KEYS, THIS IS A PROOF-OF-CONCEPT NOT THE SOLUTION
	pub, _ := base64.StdEncoding.DecodeString("J6TRfRXR5skWt6w5cFyaBxX8LPeIVxboZTLXTMhk4HM=")
	priv, _ := base64.StdEncoding.DecodeString("vFilCT/FcyeShgbpTUrpru9n5yzZey8yfhsAx6DeL80=")

	serverKeys := noise.DHKey{
		Public:  pub,
		Private: priv,
	}

	l, err := noisesocket.Listen(":"+strconv.Itoa(port), &noisesocket.ConnectionConfig{StaticKey: serverKeys})
	if err != nil {
		fmt.Println("Error listening:", err)
		os.Exit(1)
	}

	mux := http.NewServeMux()
	mux.HandleFunc(path, serverHandler())
	fmt.Println("Starting server...")
	if err := http.Serve(l, mux); err != nil {
		panic(err)
	}
}
