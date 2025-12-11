package timetrack

import (
	"time"

	"example.com/tracker/internal/domain/timetrack"
)

type Service interface {
	// Activity methods
	CreateActivity(activity *timetrack.Activity) error
	GetActivityByID(id int) (*timetrack.Activity, error)
	GetActivitiesByUserID(userID int, from, to time.Time) ([]timetrack.Activity, error)
	UpdateActivity(activity *timetrack.Activity) error
	DeleteActivity(id int) error

	// Category methods
	CreateCategory(category *timetrack.Category) error
	GetCategoryByID(id int) (*timetrack.Category, error)
	GetCategoriesByUserID(userID int) ([]timetrack.Category, error)
	UpdateCategory(category *timetrack.Category) error
	DeleteCategory(id int) error

	// Tag methods
	CreateTag(tag *timetrack.Tag) error
	GetTagByID(id int) (*timetrack.Tag, error)
	GetTagsByUserID(userID int) ([]timetrack.Tag, error)
	UpdateTag(tag *timetrack.Tag) error
	DeleteTag(id int) error
}

type service struct {
	repo timetrack.Repository
}

func NewService(repo timetrack.Repository) Service {
	return &service{
		repo: repo,
	}
}

// Activity methods
func (s *service) CreateActivity(activity *timetrack.Activity) error {
	return s.repo.CreateActivity(activity)
}

func (s *service) GetActivityByID(id int) (*timetrack.Activity, error) {
	return s.repo.GetActivityByID(id)
}

func (s *service) GetActivitiesByUserID(userID int, from, to time.Time) ([]timetrack.Activity, error) {
	return s.repo.GetActivitiesByUserID(userID, from, to)
}

func (s *service) UpdateActivity(activity *timetrack.Activity) error {
	return s.repo.UpdateActivity(activity)
}

func (s *service) DeleteActivity(id int) error {
	return s.repo.DeleteActivity(id)
}

// Category methods
func (s *service) CreateCategory(category *timetrack.Category) error {
	return s.repo.CreateCategory(category)
}

func (s *service) GetCategoryByID(id int) (*timetrack.Category, error) {
	return s.repo.GetCategoryByID(id)
}

func (s *service) GetCategoriesByUserID(userID int) ([]timetrack.Category, error) {
	return s.repo.GetCategoriesByUserID(userID)
}

func (s *service) UpdateCategory(category *timetrack.Category) error {
	return s.repo.UpdateCategory(category)
}

func (s *service) DeleteCategory(id int) error {
	return s.repo.DeleteCategory(id)
}

// Tag methods
func (s *service) CreateTag(tag *timetrack.Tag) error {
	return s.repo.CreateTag(tag)
}

func (s *service) GetTagByID(id int) (*timetrack.Tag, error) {
	return s.repo.GetTagByID(id)
}

func (s *service) GetTagsByUserID(userID int) ([]timetrack.Tag, error) {
	return s.repo.GetTagsByUserID(userID)
}

func (s *service) UpdateTag(tag *timetrack.Tag) error {
	return s.repo.UpdateTag(tag)
}

func (s *service) DeleteTag(id int) error {
	return s.repo.DeleteTag(id)
}