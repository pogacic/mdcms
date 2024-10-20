FROM golang:1.23.2

WORKDIR /go/src/app

COPY . .

EXPOSE 8090

RUN go build -o main main.go

CMD ["./main"]
