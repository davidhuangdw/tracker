package impl

import (
	"gorm.io/gorm"

	"example.com/tracker/domains/activity_tag"
)

type ActivityTagServiceImpl struct {
	DB *gorm.DB
}

func (s *ActivityTagServiceImpl) CreateActivityTag(activityTag *activity_tag.ActivityTag) error {
	return s.DB.Create(activityTag).Error
}

func (s *ActivityTagServiceImpl) GetActivityTagsByActivityID(activityID uint) ([]activity_tag.ActivityTag, error) {
	var activityTags []activity_tag.ActivityTag
	err := s.DB.Where("activity_id = ?", activityID).Find(&activityTags).Error
	return activityTags, err
}

func (s *ActivityTagServiceImpl) GetActivityTagsByTagID(tagID uint) ([]activity_tag.ActivityTag, error) {
	var activityTags []activity_tag.ActivityTag
	err := s.DB.Where("tag_id = ?", tagID).Find(&activityTags).Error
	return activityTags, err
}

func (s *ActivityTagServiceImpl) DeleteActivityTag(activityID, tagID uint) error {
	return s.DB.Where("activity_id = ? AND tag_id = ?", activityID, tagID).Delete(&activity_tag.ActivityTag{}).Error
}

func (s *ActivityTagServiceImpl) DeleteActivityTagsByActivityID(activityID uint) error {
	return s.DB.Where("activity_id = ?", activityID).Delete(&activity_tag.ActivityTag{}).Error
}

func (s *ActivityTagServiceImpl) DeleteActivityTagsByTagID(tagID uint) error {
	return s.DB.Where("tag_id = ?", tagID).Delete(&activity_tag.ActivityTag{}).Error
}