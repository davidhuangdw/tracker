package aggr

import "github.com/gin-gonic/gin"

type AggrHandler interface {
	CreateAggr(c *gin.Context)
	GetAggr(c *gin.Context)
	GetAggrs(c *gin.Context)
	UpdateAggr(c *gin.Context)
	DeleteAggr(c *gin.Context)
}