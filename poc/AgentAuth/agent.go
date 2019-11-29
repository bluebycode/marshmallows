package main

import (
	"fmt"
)

func main() {

	// Agent identification
	id := generateId()

	// Ask for secret token provided with the distribution
	secretToken := readToken()

	// {D,d} keys used to shared with broker sharing with the party
	keys := generateKeys()
	sendAuthentication("localhost:8082/open", secretToken, &keys, id)

	fmt.Println("token", secretToken)
}
