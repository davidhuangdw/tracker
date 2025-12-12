package category_builder

import (
	"example.com/tracker/services/category"
	"example.com/tracker/services/category/internal/impl"
)

func NewCategoryHandler(categoryService category.CategoryService) category.CategoryHandler {
	return impl.NewCategoryHandler(categoryService)
}
