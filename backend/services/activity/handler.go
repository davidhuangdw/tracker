package activity

import "github.com/gin-gonic/gin"

type ActivityHandler interface {
	CreateActivity(c *gin.Context)
	GetActivity(c *gin.Context)
	GetActivities(c *gin.Context)
	UpdateActivity(c *gin.Context)
	DeleteActivity(c *gin.Context)
}
