package category

type CategoryService interface {
	CreateCategory(category *Category) error
	GetCategoryByID(id uint) (*Category, error)
	GetCategories() ([]Category, error)
	UpdateCategory(category *Category) error
	DeleteCategory(id uint) error
}