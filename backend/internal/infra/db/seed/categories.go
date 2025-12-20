package seed

import (
	"fmt"
	"log"
	"os"

	"example.com/tracker/domains/category"
	"example.com/tracker/domains/category/category_builder"
	"example.com/tracker/internal/infra/db"
	"example.com/tracker/internal/pkg/utils"
	"gopkg.in/yaml.v3"
)

func SeedCategories() error {
	categoryService := category_builder.NewCategoryService(db.GormDB)

	path, err := utils.GetRelativePath("categories.yaml")
	if err != nil {
		log.Fatalf("Failed to get relative path: %v", err)
	}
	fileData, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("Failed to read YAML file: %v", err)
	}

	var categories []category.Category
	if err := yaml.Unmarshal(fileData, &categories); err != nil {
		log.Fatalf("Failed to parse YAML: %v", err)
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
