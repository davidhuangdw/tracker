package impl

import (
	"gorm.io/gorm"

	"example.com/tracker/domains/category"
)

type CategoryServiceImpl struct {
	DB *gorm.DB
}

func (s *CategoryServiceImpl) CreateCategory(category *category.Category) error {
	return s.DB.Create(category).Error
}

func (s *CategoryServiceImpl) GetCategoryByID(id uint) (*category.Category, error) {
	var category category.Category
	err := s.DB.First(&category, id).Error
	return &category, err
}

func (s *CategoryServiceImpl) GetCategories() ([]category.Category, error) {
	var categories []category.Category
	err := s.DB.Order("name").Find(&categories).Error
	return categories, err
}

func (s *CategoryServiceImpl) UpdateCategory(category *category.Category) error {
	return s.DB.Save(category).Error
}

func (s *CategoryServiceImpl) DeleteCategory(id uint) error {
	return s.DB.Delete(&category.Category{}, id).Error
}