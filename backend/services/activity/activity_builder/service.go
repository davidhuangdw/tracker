package activity_builder

import (
	"database/sql"

	"example.com/tracker/services/activity"
	"example.com/tracker/services/activity/internal/impl"
)

func NewActivityService(db *sql.DB) activity.ActivityService {
	return &impl.ActivityServiceImpl{DB: db}
}
