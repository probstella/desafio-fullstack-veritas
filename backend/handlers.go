package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/google/uuid"
)

var (
	tasks      = make(map[string]*Task)
	tasksMutex = &sync.Mutex{}
	dataFile   = "tasks.json" // opcional: persistência
)

// helper: write JSON response
func writeJSON(w http.ResponseWriter, code int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(v)
}

func loadFromFile() {
	if _, err := os.Stat(dataFile); errors.Is(err, os.ErrNotExist) {
		return
	}
	bytes, err := ioutil.ReadFile(dataFile)
	if err != nil {
		return
	}
	var list []*Task
	if err := json.Unmarshal(bytes, &list); err != nil {
		return
	}
	tasksMutex.Lock()
	defer tasksMutex.Unlock()
	for _, t := range list {
		tasks[t.ID] = t
	}
}

func saveToFile() {
	tasksMutex.Lock()
	defer tasksMutex.Unlock()
	list := make([]*Task, 0, len(tasks))
	for _, t := range tasks {
		list = append(list, t)
	}
	bytes, _ := json.MarshalIndent(list, "", "  ")
	_ = ioutil.WriteFile(dataFile, bytes, 0644)
}

// CORS middleware (allow localhost:3000)
func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// ajusta se precisar de domínios diferentes
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func getTasksHandler(w http.ResponseWriter, r *http.Request) {
	tasksMutex.Lock()
	defer tasksMutex.Unlock()
	list := make([]*Task, 0, len(tasks))
	for _, t := range tasks {
		list = append(list, t)
	}
	writeJSON(w, http.StatusOK, list)
}

type createTaskReq struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"` // optional, default "todo"
}

func validateStatus(s string) bool {
	return s == "todo" || s == "in_progress" || s == "done"
}

func createTaskHandler(w http.ResponseWriter, r *http.Request) {
	var req createTaskReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	if req.Title == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "title is required"})
		return
	}
	if req.Status == "" {
		req.Status = "todo"
	}
	if !validateStatus(req.Status) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid status"})
		return
	}

	now := time.Now()
	t := &Task{
		ID:          uuid.New().String(),
		Title:       req.Title,
		Description: req.Description,
		Status:      req.Status,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	tasksMutex.Lock()
	tasks[t.ID] = t
	tasksMutex.Unlock()

	// persist
	saveToFile()

	writeJSON(w, http.StatusCreated, t)
}

func updateTaskHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	tasksMutex.Lock()
	t, ok := tasks[id]
	tasksMutex.Unlock()
	if !ok {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "task not found"})
		return
	}

	var req createTaskReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	if req.Title == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "title is required"})
		return
	}
	if req.Status == "" {
		req.Status = t.Status
	}
	if !validateStatus(req.Status) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid status"})
		return
	}

	tasksMutex.Lock()
	t.Title = req.Title
	t.Description = req.Description
	t.Status = req.Status
	t.UpdatedAt = time.Now()
	tasksMutex.Unlock()

	saveToFile()
	writeJSON(w, http.StatusOK, t)
}

func deleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	tasksMutex.Lock()
	_, ok := tasks[id]
	if ok {
		delete(tasks, id)
	}
	tasksMutex.Unlock()

	if !ok {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "task not found"})
		return
	}

	saveToFile()
	w.WriteHeader(http.StatusNoContent)
}
