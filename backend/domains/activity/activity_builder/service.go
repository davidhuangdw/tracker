package activity_builder

import (
	"database/sql"

	"example.com/tracker/domains/activity"
	"example.com/tracker/domains/activity/internal/impl"
)

func NewActivityService(db *sql.DB) activity.ActivityService {
	return &impl.ActivityServiceImpl{DB: db}
}
