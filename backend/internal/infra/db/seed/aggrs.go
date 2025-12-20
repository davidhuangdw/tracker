package seed

import (
	"fmt"
	"log"
	"os"
	"strings"

	"example.com/tracker/domains/aggr"
	"example.com/tracker/domains/aggr/aggr_builder"
	"example.com/tracker/domains/category/category_builder"
	"example.com/tracker/internal/infra/db"
	"example.com/tracker/internal/pkg/utils"
	"gopkg.in/yaml.v3"
)

func SeedAggrs() error {
	categoryService := category_builder.NewCategoryService(db.GormDB)
	aggrService := aggr_builder.NewAggrService(db.GormDB)

	path, err := utils.GetRelativePath("aggrs.yaml")
	if err != nil {
		log.Fatalf("Failed to get relative path: %v", err)
	}
	fileData, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("Failed to read YAML file: %v", err)
	}

	type AggrSeed struct {
		Name          string `yaml:"name"`
		Color         string `yaml:"color"`
		CategoryNames string `yaml:"categoryNames"`
	}

	var aggrSeeds []AggrSeed
	if err := yaml.Unmarshal(fileData, &aggrSeeds); err != nil {
		log.Fatalf("Failed to parse YAML: %v", err)
	}

	// Get all categories to map names to IDs
	allCategories, err := categoryService.GetCategories()
	if err != nil {
		log.Fatalf("Failed to get categories: %v", err)
	}

	categoryMap := make(map[string]uint)
	for _, cat := range allCategories {
		categoryMap[cat.Name] = cat.ID
	}

	existingAggrs, err := aggrService.GetAggrs()
	if err != nil {
		log.Fatalf("Failed to get existing aggrs: %v", err)
	}
	existing := make(map[string]bool)
	for _, aggr := range existingAggrs {
		existing[aggr.Name] = true
	}

	for _, seed := range aggrSeeds {
		if existing[seed.Name] {
			continue
		}

		// Convert category names to IDs
		var categoryIDs []uint
		categoryNames := strings.Fields(seed.CategoryNames)
		for _, name := range categoryNames {
			if id, exists := categoryMap[name]; exists {
				categoryIDs = append(categoryIDs, id)
			}
		}

		// Create the aggr
		newAggr := aggr.Aggr{
			Name:        seed.Name,
			Color:       seed.Color,
			CategoryIDs: categoryIDs,
		}

		if err := aggrService.CreateAggr(&newAggr); err != nil {
			return fmt.Errorf("failed to create aggr %s: %v", seed.Name, err)
		}
		fmt.Printf("Created aggr: %s (%s) with categories: %v\n", seed.Name, seed.Color, categoryNames)
	}

	fmt.Println("Aggrs seeding done")
	return nil
}
