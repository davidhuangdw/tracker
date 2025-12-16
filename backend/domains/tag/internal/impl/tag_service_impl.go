package impl

import (
	"gorm.io/gorm"

	"example.com/tracker/domains/tag"
)

type TagServiceImpl struct {
	DB *gorm.DB
}

func (s *TagServiceImpl) CreateTag(tag *tag.Tag) error {
	return s.DB.Create(tag).Error
}

func (s *TagServiceImpl) GetTagByID(id uint) (*tag.Tag, error) {
	var tag tag.Tag
	err := s.DB.First(&tag, id).Error
	return &tag, err
}

func (s *TagServiceImpl) GetTags() ([]tag.Tag, error) {
	var tags []tag.Tag
	err := s.DB.Order("name").Find(&tags).Error
	return tags, err
}

func (s *TagServiceImpl) UpdateTag(tag *tag.Tag) error {
	return s.DB.Save(tag).Error
}

func (s *TagServiceImpl) DeleteTag(id uint) error {
	// Delete tag from activity_tags first
	if err := s.DB.Where("tag_id = ?", id).Delete(&struct{}{}).Error; err != nil {
		return err
	}

	// Delete tag
	return s.DB.Delete(&tag.Tag{}, id).Error
}