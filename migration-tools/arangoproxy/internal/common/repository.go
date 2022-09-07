package common

import (
	"crypto/tls"
	"fmt"
	"time"

	"github.com/arangodb/go-driver"
	"github.com/arangodb/go-driver/http"
)

type Repository interface {
	Execute()
}

var db driver.Client

func init() {
	Connect()
}

func Connect() {
	conn, err := http.NewConnection(http.ConnectionConfig{
		Endpoints: []string{"http://localhost:8529"},
		TLSConfig: &tls.Config{ /*...*/ },
	})
	if err != nil {
		fmt.Printf("Connection Error: %s\nRetrying in 5 secs", err.Error())
		time.Sleep(time.Second * 5)
		Connect()
	}

	db, err = driver.NewClient(driver.ClientConfig{
		Connection:     conn,
		Authentication: driver.BasicAuthentication("user", "password"),
	})
	if err != nil {
		fmt.Printf("Client Creation error: %s\nRetrying in 5 secs", err.Error())
		time.Sleep(time.Second * 5)
		Connect()
	}
}
