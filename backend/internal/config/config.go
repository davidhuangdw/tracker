package config

import (
	"log"
	"os"
	"time"

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

var GlobalConfig *Config

func LoadConfig(configPath string) error {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return err
	}

	var config Config
	if err := toml.Unmarshal(data, &config); err != nil {
		return err
	}

	GlobalConfig = &config
	log.Printf("Config loaded from: %s", configPath)
	return nil
}

func GetConfig() *Config {
	return GlobalConfig
}