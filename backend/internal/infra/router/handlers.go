package router

import (
	"example.com/tracker/services/activity"
	"example.com/tracker/services/category"
	"example.com/tracker/services/tag"
)

type Handlers struct {
	activity.ActivityHandler
	category.CategoryHandler
	tag.TagHandler
}
