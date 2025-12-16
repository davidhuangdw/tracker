package tag

import "github.com/gin-gonic/gin"

type TagHandler interface {
	CreateTag(c *gin.Context)
	GetTag(c *gin.Context)
	GetTags(c *gin.Context)
	UpdateTag(c *gin.Context)
	DeleteTag(c *gin.Context)
}
