package impl

import (
	"database/sql"

	"example.com/tracker/services/category"
)

type CategoryServiceImpl struct {
	DB *sql.DB
}

func NewCategoryService(db *sql.DB) category.CategoryService {
	return &CategoryServiceImpl{
		DB: db,
	}
}

func (s *CategoryServiceImpl) CreateCategory(category *category.Category) error {
	query := `INSERT INTO categories (user_id, name, color, description) VALUES (?, ?, ?, ?) RETURNING id, created_at, updated_at`
	return s.DB.QueryRow(query, category.UserID, category.Name, category.Color, category.Description).Scan(&category.ID, &category.CreatedAt, &category.UpdatedAt)
}

func (s *CategoryServiceImpl) GetCategoryByID(id int) (*category.Category, error) {
	query := `SELECT id, user_id, name, color, description, created_at, updated_at FROM categories WHERE id = ?`
	category := &category.Category{}
	err := s.DB.QueryRow(query, id).Scan(&category.ID, &category.UserID, &category.Name, &category.Color, &category.Description, &category.CreatedAt, &category.UpdatedAt)
	return category, err
}

func (s *CategoryServiceImpl) GetCategoriesByUserID(userID int) ([]category.Category, error) {
	query := `SELECT id, user_id, name, color, description, created_at, updated_at FROM categories WHERE user_id = ? ORDER BY name`
	rows, err := s.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []category.Category
	for rows.Next() {
		category := &category.Category{}
		err := rows.Scan(&category.ID, &category.UserID, &category.Name, &category.Color, &category.Description, &category.CreatedAt, &category.UpdatedAt)
		if err != nil {
			return nil, err
		}
		categories = append(categories, *category)
	}

	return categories, nil
}

func (s *CategoryServiceImpl) UpdateCategory(category *category.Category) error {
	query := `UPDATE categories SET name = ?, color = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
	_, err := s.DB.Exec(query, category.Name, category.Color, category.Description, category.ID)
	return err
}

func (s *CategoryServiceImpl) DeleteCategory(id int) error {
	_, err := s.DB.Exec(`DELETE FROM categories WHERE id = ?`, id)
	return err
}
