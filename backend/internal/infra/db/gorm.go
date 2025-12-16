package db

import (
	"log"
	"os"
	"path/filepath"
	"time"

	"example.com/tracker/internal/config"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var GormDB *gorm.DB

type GormLogger struct{}

func (l GormLogger) Printf(format string, args ...interface{}) {
	log.Printf("[GORM] "+format, args...)
}

func InitGormDB() error {
	cfg := config.GetConfig()
	if cfg == nil {
		log.Fatal("Config not loaded")
	}

	// Create data directory
	dataDir := filepath.Dir(cfg.Database.DSN)
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return err
	}

	// Extract DSN path (remove query parameters for directory creation)
	dsnPath := cfg.Database.DSN
	if idx := filepath.Ext(dsnPath); idx != "" {
		// Simple extraction of file path before query parameters
		dsnPath = dsnPath[:len(dsnPath)-len(filepath.Ext(dsnPath))] + filepath.Ext(dsnPath)
	}

	// Configure GORM logger
	gormLogger := logger.New(
		GormLogger{},
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	// Open database connection
	db, err := gorm.Open(sqlite.Open(cfg.Database.DSN), &gorm.Config{
		Logger: gormLogger,
	})
	if err != nil {
		return err
	}

	// Get underlying SQL DB for connection pool settings
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}

	sqlDB.SetMaxOpenConns(cfg.Database.MaxOpenConns)
	sqlDB.SetMaxIdleConns(cfg.Database.MaxIdleConns)
	sqlDB.SetConnMaxLifetime(cfg.Database.ConnMaxLifetime * time.Second)

	GormDB = db
	log.Printf("GORM database connected successfully: %s", cfg.Database.DSN)
	return nil
}

func GetDB() *gorm.DB {
	return GormDB
}

func CloseGormDB() error {
	if GormDB != nil {
		sqlDB, err := GormDB.DB()
		if err != nil {
			return err
		}
		return sqlDB.Close()
	}
	return nil
}