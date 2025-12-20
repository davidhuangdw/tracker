package db

import (
	"log"

	"example.com/tracker/domains/activity"
	"example.com/tracker/domains/activity_tag"
	"example.com/tracker/domains/aggr"
	"example.com/tracker/domains/category"
	"example.com/tracker/domains/tag"
	"example.com/tracker/domains/user"
	"github.com/go-gormigrate/gormigrate/v2"
	"gorm.io/gorm"
)

func RunMigrations() error {
	m := gormigrate.New(GetDB(), gormigrate.DefaultOptions, []*gormigrate.Migration{
		{
			ID: "20250101000001",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(
					&user.User{},
					&category.Category{},
					&tag.Tag{},
					&activity.Activity{},
					&activity_tag.ActivityTag{},
					&aggr.Aggr{},
				)
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(
					"users",
					"categories",
					"tags",
					"activities",
					"activity_tags",
					"aggrs",
				)
			},
		},
	})

	if err := m.Migrate(); err != nil {
		log.Printf("Migration failed: %v", err)
		return err
	}

	log.Println("Database migrations completed successfully")
	return nil
}
