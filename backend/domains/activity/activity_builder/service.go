package activity_builder

import (
	"example.com/tracker/domains/activity"
	"example.com/tracker/domains/activity/internal/impl"
	"gorm.io/gorm"
)

func NewActivityService(db *gorm.DB) activity.ActivityService {
	return &impl.ActivityServiceImpl{DB: db}
}
