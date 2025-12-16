package activity

import (
	"time"

	"example.com/tracker/domains/tag"
)

type Activity struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	Name       string    `json:"name" gorm:"size:255"`
	From       time.Time `json:"from" gorm:"not null"`
	To         time.Time `json:"to" gorm:"not null"`
	CategoryID uint      `json:"category_id" gorm:"not null;index"`
	Tags       []tag.Tag `json:"tags" gorm:"many2many:activity_tags;"`
	CreatedAt  time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt  time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}