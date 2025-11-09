package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	loadFromFile()

	r := mux.NewRouter()
	api := r.PathPrefix("/tasks").Subrouter()
	api.HandleFunc("", getTasksHandler).Methods("GET")
	api.HandleFunc("", createTaskHandler).Methods("POST")
	api.HandleFunc("/{id}", updateTaskHandler).Methods("PUT")
	api.HandleFunc("/{id}", deleteTaskHandler).Methods("DELETE")

	handler := withCORS(r)

	addr := ":8080"
	log.Printf("backend rodando em %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal(err)
	}
}
