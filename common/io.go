// @vrandkode
// Developed before competition.
//

// Those structures helps with I/O redirection (Pipe) and provides a Reader/Writer interface (ReadWriteConnector).
package main

import (
	"fmt"
	"io"
	"websocket"
)

// Pipe ...applys a function setting up a I/O pipe
type Pipe struct {
	id string
	r  io.Reader
	w  io.Writer
	f  func(in []byte, size int) []byte
}

// attach ... attach the handler and performs f(x) if requires
func (p *Pipe) attach(finish chan struct{}) {
	buffer := make([]byte, 1024)
	for {
		n, err := p.r.Read(buffer)
		if err != nil {
			finish <- struct{}{}
		}
		fmt.Println("[pipe] Read  (", n, ") ....", buffer[:n])

		if p.f != nil {
			output := p.f(buffer[:n], n)
			fmt.Println("["+p.id+"::pipe]   Write (", n, ") ....", output[:])
			p.w.Write(output[:])
		} else {
			fmt.Println("["+p.id+"::pipe]   Write (", n, ") ....", buffer[:n])
			p.w.Write(buffer[:n])
		}
	}
}

// ReadWriteConnector ... adapter which allows to websocket connection be provided with Reader/Writer interface
type ReadWriteConnector struct {
	id string
	r  io.Reader
	c  *websocket.Conn
}

// Write ... write method
func (c *ReadWriteConnector) Write(p []byte) (int, error) {
	fmt.Println("["+c.id+"::client] Sending ...", p)
	err := c.c.WriteMessage(websocket.BinaryMessage, p)
	if err != nil {
		return 0, err
	}
	return len(p), nil
}

// Read ... read method
func (c *ReadWriteConnector) Read(p []byte) (int, error) {
	for {
		if c.r == nil {
			var err error
			_, c.r, err = c.c.NextReader()
			if err != nil {
				return 0, err
			}
		}
		n, err := c.r.Read(p)
		fmt.Println("["+c.id+"::client] Reading (", n, ") ...", p[:n])
		if err == io.EOF {
			c.r = nil
			if n > 0 {
				return n, nil
			} else {
				continue
			}
		}
		return n, err
	}
}

/// Close  ... close method
func (c *ReadWriteConnector) Close() error {
	return c.c.Close()
}
