package app

import (
	"log"

	"example.com/tracker/domains/activity/activity_builder"
	"example.com/tracker/domains/activity_tag/activity_tag_builder"
	"example.com/tracker/domains/category/category_builder"
	"example.com/tracker/domains/tag/tag_builder"
	"example.com/tracker/internal/config"
	"example.com/tracker/internal/infra/db"
	"example.com/tracker/internal/infra/router"
)

func Init() (func() error, error) {
	// Load configuration
	if err := config.LoadConfig("config.toml"); err != nil {
		log.Fatalf("Warning: Could not load config.toml, using defaults: %v", err)
	}

	// Initialize GORM database
	if err := db.InitGormDB(); err != nil {
		return nil, err
	}

	// Run database migrations
	if err := db.RunMigrations(); err != nil {
		return nil, err
	}

	// Initialize domain services & handlers
	activityService := activity_builder.NewActivityService(db.GormDB)
	categoryService := category_builder.NewCategoryService(db.GormDB)
	tagService := tag_builder.NewTagService(db.GormDB)
	activityTagService := activity_tag_builder.NewActivityTagService(db.GormDB)

	handlers := router.Handlers{
		activity_builder.NewActivityHandler(activityService),
		category_builder.NewCategoryHandler(categoryService),
		tag_builder.NewTagHandler(tagService),
		activity_tag_builder.NewActivityTagHandler(activityTagService),
	}

	log.Println("Application initialized successfully")

	run := func() error {
		return router.StartServer(handlers)
	}

	return run, nil
}

func Shutdown() {
	if err := db.CloseGormDB(); err != nil {
		log.Printf("Error closing database: %v", err)
	}
	log.Println("Application shutdown completed")
}
