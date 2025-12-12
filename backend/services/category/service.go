package category

type CategoryService interface {
	CreateCategory(category *Category) error
	GetCategoryByID(id int) (*Category, error)
	GetCategoriesByUserID(userID int) ([]Category, error)
	UpdateCategory(category *Category) error
	DeleteCategory(id int) error
}
