package category_builder

import (
	"database/sql"

	"example.com/tracker/services/category"
	"example.com/tracker/services/category/internal/impl"
)

func NewCategoryService(db *sql.DB) category.CategoryService {
	return &impl.CategoryServiceImpl{DB: db}
}
