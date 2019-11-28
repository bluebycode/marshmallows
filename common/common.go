// @vrandkode
// Developed before competition.
package main

import (
	"encoding/binary"
	"math/rand"
	"strconv"
	"time"
)

func last(str []string) string {
	return str[len(str)-1]
}

// Version returns the current version representation.
func Version() string {
	return "0.1"
}

// GenerateToken returns a generated token based on expected size
func GenerateToken(n int) string {
	var letter = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	b := make([]rune, n)
	for i := range b {
		b[i] = letter[rand.Intn(len(letter))]
	}
	return string(b)
}

// Int2string ... int 2 string conversion
func Int2string(n int) string {
	return strconv.FormatInt(int64(n), 10)
}

// toTimestamp ... transform time into milliseconds
func toTimestamp(t time.Time) int64 {
	return t.UnixNano() / int64(time.Millisecond)
}

// EncodeTimestamp serialise the timestamp
func EncodeTimestamp(t time.Time) []byte {
	buf := make([]byte, 8)
	u := uint64(t.Unix())
	binary.BigEndian.PutUint64(buf, u)
	return buf
}
