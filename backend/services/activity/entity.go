package activity

import (
	"time"

	"example.com/tracker/services/tag"
)

type Activity struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	From       time.Time `json:"from"`
	To         time.Time `json:"to"`
	Name       string    `json:"name"`
	CategoryID int       `json:"category_id"`
	Tags       []tag.Tag `json:"tags"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type ActivityTag struct {
	ActivityID int `json:"activity_id"`
	TagID      int `json:"tag_id"`
}
