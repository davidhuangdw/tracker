package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"example.com/tracker/internal/app"
)

func main() {
	// Initialize application
	run, err := app.Init()
	if err != nil {
		log.Fatalf("Failed to initialize application: %v", err)
	}

	// Setup graceful shutdown
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	// Start Gin server
	go func() {
		if err := run(); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	log.Println("Server started. Press Ctrl+C to shutdown.")

	// Wait for shutdown signal
	<-shutdown
	log.Println("Shutdown signal received, shutting down...")

	app.Shutdown()
	log.Println("Server shutdown completed")
}
