package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"example.com/tracker/domains/category"
	"example.com/tracker/domains/category/category_builder"
	"example.com/tracker/internal/infra/db"
	"example.com/tracker/internal/pkg/utils"
)

var (
	categoryService category.CategoryService
)

func main() {
	// Initialize database connection
	if err := db.InitGormDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Seed only new categories
	if err := seedCategories(categoryService); err != nil {
		log.Fatalf("Failed to seed categories: %v", err)
	}

}

func seedCategories(categoryService category.CategoryService) error {
	// Create category service
	categoryService = category_builder.NewCategoryService(db.GormDB)

	// Read categories from JSON file
	path, err := utils.GetRelativePath("init_categories.json")
	if err != nil {
		log.Fatalf("Failed to get relative path: %v", err)
	}
	fileData, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("Failed to read JSON file: %v", err)
	}

	var categories []category.Category
	if err := json.Unmarshal(fileData, &categories); err != nil {
		log.Fatalf("Failed to parse JSON: %v", err)
	}

	existingCategories, err := categoryService.GetCategories()
	if err != nil {
		log.Fatalf("Failed to get existing categories: %v", err)
	}
	existing := make(map[string]bool)
	for _, cat := range existingCategories {
		existing[cat.Name] = true
	}

	for _, cate := range categories {
		if existing[cate.Name] {
			continue
		}
		if err := categoryService.CreateCategory(&cate); err != nil {
			return fmt.Errorf("failed to create category %s: %v", cate.Name, err)
		}
		fmt.Printf("Created category: %s (%s)\n", cate.Name, cate.Color)
	}

	fmt.Println("Categories seeding done")
	return nil
}
