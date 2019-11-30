package main

// References: https://raw.githubusercontent.com/go-noisesocket/noisesocket
import (
	"bytes"
	"encoding/base64"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"strconv"

	requests "./protocol"
	"github.com/flynn/noise"
	"github.com/golang/protobuf/proto"
	"gopkg.in/noisesocket.v0"
)

func httpClient(address string, port int, path string, buffer []byte) {
	// NOTE: BE AWARE ABOUT HARDCODED KEYS, THIS IS A PROOF-OF-CONCEPT NOT THE SOLUTION
	pub1, _ := base64.StdEncoding.DecodeString("L9Xm5qy17ZZ6rBMd1Dsn5iZOyS7vUVhYK+zby1nJPEE=")
	priv1, _ := base64.StdEncoding.DecodeString("TPmwb3vTEgrA3oq6PoGEzH5hT91IDXGC9qEMc8ksRiw=")

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
	auth := &requests.AgentAuth{
		Token:     proto.String("mytokenmaravilloso"),
		PublicKey: proto.String("mysecretpublickey"),
		DeviceId:  proto.String("abcde"),
	}
	data, err := proto.Marshal(auth)
	if err != nil {
		log.Fatal("marshaling error: ", err)
	}
	httpClient("localhost", 7777, "/open", data)
}
