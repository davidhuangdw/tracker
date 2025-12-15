package category_builder

import (
	"database/sql"

	"example.com/tracker/domains/category"
	"example.com/tracker/domains/category/internal/impl"
)

func NewCategoryService(db *sql.DB) category.CategoryService {
	return &impl.CategoryServiceImpl{DB: db}
}
