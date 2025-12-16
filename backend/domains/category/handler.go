package category

import "github.com/gin-gonic/gin"

type CategoryHandler interface {
	CreateCategory(c *gin.Context)
	GetCategory(c *gin.Context)
	GetCategories(c *gin.Context)
	UpdateCategory(c *gin.Context)
	DeleteCategory(c *gin.Context)
}
