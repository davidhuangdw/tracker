package router

import (
	"example.com/tracker/domains/activity"
	"example.com/tracker/domains/category"
	"example.com/tracker/domains/tag"
)

type Handlers struct {
	activity.ActivityHandler
	category.CategoryHandler
	tag.TagHandler
}
