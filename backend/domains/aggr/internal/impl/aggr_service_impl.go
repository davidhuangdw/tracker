package impl

import (
	"example.com/tracker/domains/aggr"
	"gorm.io/gorm"
)

type AggrServiceImpl struct {
	DB *gorm.DB
}

func NewAggrService(db *gorm.DB) aggr.AggrService {
	return &AggrServiceImpl{DB: db}
}

func (s *AggrServiceImpl) CreateAggr(aggr *aggr.Aggr) error {
	return s.DB.Create(aggr).Error
}

func (s *AggrServiceImpl) GetAggrByID(id uint) (*aggr.Aggr, error) {
	var a aggr.Aggr
	if err := s.DB.First(&a, id).Error; err != nil {
		return nil, err
	}
	return &a, nil
}

func (s *AggrServiceImpl) GetAggrs() ([]aggr.Aggr, error) {
	var aggrs []aggr.Aggr
	if err := s.DB.Find(&aggrs).Error; err != nil {
		return nil, err
	}
	return aggrs, nil
}

func (s *AggrServiceImpl) UpdateAggr(aggr *aggr.Aggr) error {
	return s.DB.Save(aggr).Error
}

func (s *AggrServiceImpl) DeleteAggr(id uint) error {
	return s.DB.Delete(&aggr.Aggr{}, id).Error
}