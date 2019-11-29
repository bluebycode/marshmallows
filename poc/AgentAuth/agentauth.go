package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
	// Read auth token
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Please, enter agent token: ")
	token, _ := reader.ReadString('\n')
}