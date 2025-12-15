package tag_builder

import (
	"example.com/tracker/domains/tag"
	"example.com/tracker/domains/tag/internal/impl"
)

func NewTagHandler(tagService tag.TagService) tag.TagHandler {
	return impl.NewTagHandler(tagService)
}
