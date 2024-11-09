package main

import (
	"bytes"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func (app *application) readBinaryFile(a string, w http.ResponseWriter, r *http.Request) {
	f, err := os.Open(a)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
	defer f.Close()

	// TODO: remove the pi! Testing purposes remove after testing
	var pi float64
	err = binary.Read(f, binary.LittleEndian, &pi)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
	fmt.Println(pi)
}

func (app *application) writeBinFile(b []byte, w http.ResponseWriter, r *http.Request) string {
	type FileDetails struct {
		LastModified int64
		Name         string
		Size         int64
		Type         string
	}

	i := bytes.Split(b, []byte("\r\n\r\n"))

	hdr := bytes.Split(i[0], []byte("!"))
	fldetails := &FileDetails{}
	_ = json.Unmarshal(hdr[1], fldetails)
	a := fldetails.Name

	f, err := os.Create(a)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return ""
	}
	defer func() {
		if err := f.Close(); err != nil {
			app.serverErrorResponse(w, r, err)
		}
	}()

	err = binary.Write(f, binary.LittleEndian, i[1])
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return ""
	}
	return a
}
