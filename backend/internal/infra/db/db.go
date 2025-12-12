package db

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() error {
	// Create data directory
	dataDir := "tmp"
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return err
	}

	// Use local SQLite file
	dbPath := filepath.Join(dataDir, "tracker.db")

	// SQLite connection parameters with WAL mode for better concurrency
	connectionString := dbPath + "?_journal_mode=WAL&_sync=NORMAL&_busy_timeout=5000"

	var err error
	DB, err = sql.Open("sqlite3", connectionString)
	if err != nil {
		return err
	}

	// Increase connection pool size for SQLite
	DB.SetMaxOpenConns(20)
	DB.SetMaxIdleConns(10)
	DB.SetConnMaxLifetime(time.Hour)

	if err = DB.Ping(); err != nil {
		return err
	}

	log.Printf("Database connected successfully: %s", dbPath)
	return nil
}

func CloseDB() error {
	return DB.Close()
}