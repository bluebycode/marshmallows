package main

import (
    "bufio"
    "fmt"
	"os"
	"math/rand"
	"time"
)

// Read auth token
func readToken () string {
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Please, enter agent token: ")
	token, _ := reader.ReadString('\n')
	return token
}

// Generate ID
func generateId () string {
	var charset = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))
	var length = 64
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

// Main only shows the result of functions
func main() {
	fmt.Print(readToken())
	fmt.Print(generateId())
	fmt.Print("\n")
}
