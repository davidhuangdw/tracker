package tag_builder

import (
	"example.com/tracker/services/tag"
	"example.com/tracker/services/tag/internal/impl"
)

func NewTagHandler(tagService tag.TagService) tag.TagHandler {
	return impl.NewTagHandler(tagService)
}
