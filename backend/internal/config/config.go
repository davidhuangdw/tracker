package config

import (
	"log"
	"os"
	"sync"
	"time"

	"example.com/tracker/internal/pkg/utils"
	"github.com/pelletier/go-toml/v2"
)

type Config struct {
	App      AppConfig      `toml:"app"`
	Database DatabaseConfig `toml:"database"`
	Log      LogConfig      `toml:"log"`
}

type AppConfig struct {
	Name    string `toml:"name"`
	Version string `toml:"version"`
	Port    string `toml:"port"`
	Debug   bool   `toml:"debug"`
}

type DatabaseConfig struct {
	Driver          string        `toml:"driver"`
	DSN             string        `toml:"dsn"`
	MaxOpenConns    int           `toml:"max_open_conns"`
	MaxIdleConns    int           `toml:"max_idle_conns"`
	ConnMaxLifetime time.Duration `toml:"conn_max_lifetime"`
}

type LogConfig struct {
	Level  string `toml:"level"`
	Format string `toml:"format"`
}

const configPath = "config.toml"

var once sync.Once
var GlobalConfig *Config

func LoadConfig() error {
	fullPath, err := utils.GetRelativePath(configPath)
	if err != nil {
		return nil
	}
	data, err := os.ReadFile(fullPath)
	if err != nil {
		return err
	}

	var config Config
	if err := toml.Unmarshal(data, &config); err != nil {
		return err
	}

	GlobalConfig = &config
	log.Printf("Config loaded from: %s", fullPath)
	return nil
}

func GetConfig() *Config {
	once.Do(func() {
		if err := LoadConfig(); err != nil {
			log.Fatalf("Warning: Could not load config file %v, using defaults: %v", configPath, err)
		}
	})
	return GlobalConfig
}
