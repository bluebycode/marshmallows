FROM golang:latest

WORKDIR /broker

# Dependencies
COPY go.mod go.sum ./
RUN go mod download
COPY . .

# Project building
RUN go build -o broker .

EXPOSE 8081
CMD ["./broker"]