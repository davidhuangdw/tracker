package aggr_builder

import (
	"example.com/tracker/domains/aggr"
	"example.com/tracker/domains/aggr/internal/impl"
)

func NewAggrHandler(aggrService aggr.AggrService) aggr.AggrHandler {
	return &impl.AggrHandlerImpl{Service: aggrService}
}
