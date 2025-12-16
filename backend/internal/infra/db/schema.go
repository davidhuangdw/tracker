package db

import (
	"log"

	"example.com/tracker/domains/activity"
	"example.com/tracker/domains/activity_tag"
	"example.com/tracker/domains/category"
	"example.com/tracker/domains/tag"
	"example.com/tracker/domains/user"
	"gorm.io/gorm"
)

func InitSchema(db *gorm.DB) error {
	// Auto migrate all domain models
	err := db.AutoMigrate(
		&user.User{},
		&category.Category{},
		&tag.Tag{},
		&activity.Activity{},
		&activity_tag.ActivityTag{},
	)
	if err != nil {
		return err
	}

	// Create default user if not exists
	var count int64
	db.Model(&user.User{}).Count(&count)
	if count == 0 {
		defaultUser := &user.User{
			Name:  "Default User",
			Email: "default@example.com",
		}
		if err := db.Create(defaultUser).Error; err != nil {
			return err
		}
	}

	log.Println("Database schema migrated successfully using GORM")
	return nil
}