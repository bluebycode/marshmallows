package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func main() {

	hub := newMainHub()
	go hub.Start()

	port := 8081

	// routes
	router := mux.NewRouter()

	// server
	http.Handle("/", router)
	fmt.Println("Waiting for connections :" + strconv.Itoa(port))
	err := http.ListenAndServe(":"+strconv.Itoa(port), nil)
	if err != nil {
		log.Fatal("[main] ListenAndServe: ", err)
	}
}
