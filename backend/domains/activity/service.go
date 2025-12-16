package activity

import (
	"time"
)

type ActivityService interface {
	CreateActivity(activity *Activity) error
	GetActivityByID(id uint) (*Activity, error)
	GetActivities(from, to time.Time) ([]Activity, error)
	UpdateActivity(activity *Activity) error
	DeleteActivity(id uint) error
}