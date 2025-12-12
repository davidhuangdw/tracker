package activity_builder

import (
	"example.com/tracker/services/activity"
	"example.com/tracker/services/activity/internal/impl"
)

func NewActivityHandler(activityService activity.ActivityService) activity.ActivityHandler {
	return &impl.ActivityHandlerImpl{
		ActivityService: activityService,
	}
}
