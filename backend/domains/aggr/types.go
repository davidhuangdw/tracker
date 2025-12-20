package aggr

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

type CategoryIDs []uint

// Value implements the driver.Valuer interface
func (c CategoryIDs) Value() (driver.Value, error) {
	if len(c) == 0 {
		return "[]", nil
	}
	return json.Marshal(c)
}

// Scan implements the sql.Scanner interface
func (c *CategoryIDs) Scan(value interface{}) error {
	if value == nil {
		*c = CategoryIDs{}
		return nil
	}
	
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	
	return json.Unmarshal(bytes, c)
}

type Aggr struct {
	ID          uint        `json:"id" gorm:"primaryKey"`
	Name        string      `json:"name" gorm:"size:255;uniqueIndex"`
	Color       string      `json:"color" gorm:"size:7"`
	CategoryIDs CategoryIDs `json:"category_ids" gorm:"type:text"`
	Description string      `json:"description" gorm:"type:text"`
	CreatedAt   time.Time   `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time   `json:"updated_at" gorm:"autoUpdateTime"`
}