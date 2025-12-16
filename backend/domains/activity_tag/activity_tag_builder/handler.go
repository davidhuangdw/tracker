package activity_tag_builder

import (
	"example.com/tracker/domains/activity_tag"
	"example.com/tracker/domains/activity_tag/internal/impl"
)

func NewActivityTagHandler(activityTagService activity_tag.ActivityTagService) activity_tag.ActivityTagHandler {
	return &impl.ActivityTagHandlerImpl{ActivityTagService: activityTagService}
}