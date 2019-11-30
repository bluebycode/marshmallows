
package main

import (
	"bytes"
	"strconv"
    "bufio"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"log"
	"encoding/base64"
	rand "math/rand"
	"time"
	"net"
	"net/http"
	"github.com/flynn/noise"
	crand "crypto/rand"
	requests "./protocol"
	"github.com/golang/protobuf/proto"
	"gopkg.in/noisesocket.v0"
	"bufio"
	"fmt"
	"os"
)

// Generate ID
func generateId () string {
	var charset = "0123456789abcdef"
	var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))
	var length = 6
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

// Generate Noise DH keys
func generateKeys() noise.DHKey {
    key, _ := noise.DH25519.GenerateKeypair(crand.Reader)
    return key
}

// HTTP Connection to Server
func httpClient(address string, port int, path string, buffer []byte) {

	clientKeys := noise.DHKey{
		Public:  pub1,
		Private: priv1,
	}

	transport := &http.Transport{
		MaxIdleConnsPerHost: 1,
		DisableKeepAlives:   true,

		DialTLS: func(network, addr string) (net.Conn, error) {
			conn, err := noisesocket.Dial(addr, &noisesocket.ConnectionConfig{StaticKey: clientKeys})
			if err != nil {
				fmt.Println("Dial", err)
			}
			return conn, err
		},
	}

	c := make(chan bool)
	go func() {
		cli := &http.Client{
			Transport: transport,
		}
		reader := bytes.NewReader(buffer)
		req, err := http.NewRequest("POST", "https://"+address+":"+strconv.Itoa(port)+path, reader)
		if err != nil {
			panic(err)
		}

		resp, err := cli.Do(req)
		if err != nil {
			fmt.Println(err)
			return
		}
		_, err = io.Copy(ioutil.Discard, resp.Body)
		if err != nil {
			panic(err)
		}
		err = resp.Body.Close()
		if err != nil {
			panic(err)
		}
		c <- true
	}()

	<-c

	fmt.Println("done.")
}


func main() {

	token := readToken()
	keys := generateKeys()
	pubKey := base64.StdEncoding.EncodeToString(keys.Public)
	devId := generateId()

	auth := &requests.AgentAuth {
		Token:		proto.String(token),
		PublicKey:	proto.String(pubKey),
		DeviceId:	proto.String(devId),
	}
	
	data, err := proto.Marshal(auth)
	if err != nil {
		log.Fatal("marshaling error: ", err)
	}

	httpClient("localhost", 7777, "/open", data)

	fmt.Println("token", token)
}

