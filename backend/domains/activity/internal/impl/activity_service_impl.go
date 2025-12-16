package impl

import (
	"time"

	"example.com/tracker/domains/activity"
	"gorm.io/gorm"
)

type ActivityServiceImpl struct {
	DB *gorm.DB
}

func (s *ActivityServiceImpl) CreateActivity(activity *activity.Activity) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(activity).Error; err != nil {
			return err
		}

		if len(activity.Tags) > 0 {
			if err := tx.Model(activity).Association("Tags").Replace(activity.Tags); err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *ActivityServiceImpl) GetActivityByID(id uint) (*activity.Activity, error) {
	var activity activity.Activity
	err := s.DB.Preload("Tags").First(&activity, id).Error
	return &activity, err
}

func (s *ActivityServiceImpl) GetActivities(from, to time.Time) ([]activity.Activity, error) {
	var activities []activity.Activity
	err := s.DB.Preload("Tags").Where("`from` >= ? AND `to` <= ?", from, to).Order("`from`").Find(&activities).Error
	return activities, err
}

func (s *ActivityServiceImpl) UpdateActivity(activity *activity.Activity) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(activity).Error; err != nil {
			return err
		}

		if err := tx.Model(activity).Association("Tags").Replace(activity.Tags); err != nil {
			return err
		}

		return nil
	})
}

func (s *ActivityServiceImpl) DeleteActivity(id uint) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		var activity activity.Activity
		if err := tx.Preload("Tags").First(&activity, id).Error; err != nil {
			return err
		}

		if err := tx.Model(&activity).Association("Tags").Clear(); err != nil {
			return err
		}

		return tx.Delete(&activity).Error
	})
}
