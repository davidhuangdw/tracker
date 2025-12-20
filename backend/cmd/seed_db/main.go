package main

import (
	"log"

	"example.com/tracker/internal/infra/db"
	"example.com/tracker/internal/infra/db/seed"
)

func main() {
	if err := db.InitGormDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	if err := seed.SeedCategories(); err != nil {
		log.Fatalf("Failed to seed categories: %v", err)
	}

	if err := seed.SeedAggrs(); err != nil {
		log.Fatalf("Failed to seed aggrs: %v", err)
	}

}
