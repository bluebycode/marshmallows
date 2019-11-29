package main

import (
    "bufio"
    "fmt"
    "os"
)

// Read auth token
func readToken () string {
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Please, enter agent token: ")
	token, _ := reader.ReadString('\n')
	return token
}

func main() {
	fmt.Print(readToken())

}