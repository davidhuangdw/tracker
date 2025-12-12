package activity

import "time"

type ActivityService interface {
	CreateActivity(activity *Activity) error
	GetActivityByID(id int) (*Activity, error)
	GetActivitiesByUserID(userID int, from, to time.Time) ([]Activity, error)
	UpdateActivity(activity *Activity) error
	DeleteActivity(id int) error
}
