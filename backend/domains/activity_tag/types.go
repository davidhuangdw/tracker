package activity_tag

import (
	"time"
)

type ActivityTag struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	ActivityID uint      `json:"activity_id" gorm:"not null;index"`
	TagID      uint      `json:"tag_id" gorm:"not null;index"`
	CreatedAt  time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt  time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}