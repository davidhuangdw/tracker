package category_builder

import (
	"example.com/tracker/domains/category"
	"example.com/tracker/domains/category/internal/impl"
)

func NewCategoryHandler(categoryService category.CategoryService) category.CategoryHandler {
	return impl.NewCategoryHandler(categoryService)
}
