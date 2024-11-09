package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"net/http"
)

func (app *application) websocketHandler(w http.ResponseWriter, r *http.Request) {

	app.upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	conn, err := app.upgrader.Upgrade(w, r, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
	go app.renderer(conn, w, r)
}

func (app *application) renderer(conn *websocket.Conn, w http.ResponseWriter, r *http.Request) {
	// TODO: Make this api a go routine to handle multiple connections
	defer func() {
		err := conn.Close()
		if err != nil {
			fmt.Println("Failed to close the connection..")
		}
	}()

	for {
		msgType, msg, err := conn.ReadMessage()
		if err != nil {
			app.serverErrorResponse(w, r, err)
			break
		} else {
			if msgType == 2 {
				// fmt.Println("Yes got the bindata\n")
				fmt.Println("Data: ", msg)
				f := app.writeBinFile(msg, w, r)
				app.readBinaryFile(f, w, r)

			} else {
				fmt.Println("got the some other data\n")
			}
		}
	}
}
