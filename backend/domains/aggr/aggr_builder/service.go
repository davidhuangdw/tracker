package aggr_builder

import (
	"example.com/tracker/domains/aggr"
	"gorm.io/gorm"

	"example.com/tracker/domains/aggr/internal/impl"
)

func NewAggrService(db *gorm.DB) aggr.AggrService {
	return &impl.AggrServiceImpl{DB: db}
}
