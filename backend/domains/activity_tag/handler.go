package activity_tag

import (
	"github.com/gin-gonic/gin"
)

type ActivityTagHandler interface {
	CreateActivityTag(c *gin.Context)
	GetActivityTagsByActivityID(c *gin.Context)
	GetActivityTagsByTagID(c *gin.Context)
	DeleteActivityTag(c *gin.Context)
}
