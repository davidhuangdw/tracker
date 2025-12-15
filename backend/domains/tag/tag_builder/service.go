package tag_builder

import (
	"database/sql"

	"example.com/tracker/domains/tag"
	"example.com/tracker/domains/tag/internal/impl"
)

func NewTagService(db *sql.DB) tag.TagService {
	return &impl.TagServiceImpl{DB: db}
}
