package category_builder

import (
	"example.com/tracker/domains/category"
	"gorm.io/gorm"

	"example.com/tracker/domains/category/internal/impl"
)

func NewCategoryService(db *gorm.DB) category.CategoryService {
	return &impl.CategoryServiceImpl{DB: db}
}
