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
	// 创建 data 目录
	dataDir := "tmp"
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return err
	}

	// 使用本地 SQLite 文件
	dbPath := filepath.Join(dataDir, "tracker.db")

	// 添加 SQLite 连接参数，启用 WAL 模式提高并发性能
	connectionString := dbPath + "?_journal_mode=WAL&_sync=NORMAL&_busy_timeout=5000"

	var err error
	DB, err = sql.Open("sqlite3", connectionString)
	if err != nil {
		return err
	}

	// 增加连接池大小，SQLite 支持多个只读连接
	DB.SetMaxOpenConns(20)           // 增加最大连接数
	DB.SetMaxIdleConns(10)           // 增加空闲连接数
	DB.SetConnMaxLifetime(time.Hour) // 连接最大生存时间

	if err = DB.Ping(); err != nil {
		return err
	}

	log.Printf("Database connected successfully: %s", dbPath)
	return nil
}

func CloseDB() error {
	return DB.Close()
}
