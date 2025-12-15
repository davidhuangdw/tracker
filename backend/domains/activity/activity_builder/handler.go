package activity_builder

import (
	"example.com/tracker/domains/activity"
	"example.com/tracker/domains/activity/internal/impl"
)

func NewActivityHandler(activityService activity.ActivityService) activity.ActivityHandler {
	return &impl.ActivityHandlerImpl{
		ActivityService: activityService,
	}
}
