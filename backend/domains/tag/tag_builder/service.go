package tag_builder

import (
	"example.com/tracker/domains/tag"
	"gorm.io/gorm"

	"example.com/tracker/domains/tag/internal/impl"
)

func NewTagService(db *gorm.DB) tag.TagService {
	return &impl.TagServiceImpl{DB: db}
}
