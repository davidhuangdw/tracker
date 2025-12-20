package aggr

type AggrService interface {
	CreateAggr(aggr *Aggr) error
	GetAggrByID(id uint) (*Aggr, error)
	GetAggrs() ([]Aggr, error)
	UpdateAggr(aggr *Aggr) error
	DeleteAggr(id uint) error
}