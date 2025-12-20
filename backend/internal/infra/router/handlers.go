package router

import (
	"example.com/tracker/domains/activity"
	"example.com/tracker/domains/activity_tag"
	"example.com/tracker/domains/aggr"
	"example.com/tracker/domains/category"
	"example.com/tracker/domains/tag"
)

type Handlers struct {
	activity.ActivityHandler
	category.CategoryHandler
	tag.TagHandler
	activity_tag.ActivityTagHandler
	aggr.AggrHandler
}