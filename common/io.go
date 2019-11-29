// @vrandkode
// Developed before competition.
//

// Those structures helps with I/O redirection (Pipe) and provides a Reader/Writer interface (ReadWriteConnector).
package main

import (
	"io"
	"websocket"
)

// Pipe ...
type Pipe struct {
}

func (p *Pipe) in(r io.Reader, w io.Writer) {
	buffer := make([]byte, 1024)
	for {
		n, err := r.Read(buffer)
		if err != nil {
			panic(err)
		}
		w.Write(buffer[:n])
	}
}

func (p *Pipe) out(r io.Reader, w io.Writer) {
	buffer := make([]byte, 1024)
	for {
		n, err := r.Read(buffer)
		if err != nil {
			panic(err)
		}
		w.Write(buffer[:n])
	}
}

// ReadWriteConnector ... adapter which allows to websocket connection be provided with Reader/Writer interface
type rwc struct {
	r io.Reader
	c *websocket.Conn
}

// Write ... write method
func (c *rwc) Write(p []byte) (int, error) {
	err := c.c.WriteMessage(websocket.TextMessage, p)
	if err != nil {
		return 0, err
	}
	return len(p), nil
}

// Read ... read method
func (c *rwc) Read(p []byte) (int, error) {
	for {
		if c.r == nil {
			var err error
			_, c.r, err = c.c.NextReader()
			if err != nil {
				return 0, err
			}
		}
		n, err := c.r.Read(p)
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
func (c *rwc) Close() error {
	return c.c.Close()
}
