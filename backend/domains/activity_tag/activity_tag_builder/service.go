package activity_tag_builder

import (
	"gorm.io/gorm"

	"example.com/tracker/domains/activity_tag"
	"example.com/tracker/domains/activity_tag/internal/impl"
)

func NewActivityTagService(db *gorm.DB) activity_tag.ActivityTagService {
	return &impl.ActivityTagServiceImpl{DB: db}
}