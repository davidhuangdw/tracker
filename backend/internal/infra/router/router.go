package router

import (
	"github.com/gin-gonic/gin"
)

func SetupRouter(handlers Handlers) *gin.Engine {
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// API routes
	api := r.Group("/api")
	{
		// Timetrack routes
		activity := api.Group("/activities")
		{
			activity.POST("", handlers.CreateActivity)
			activity.GET("", handlers.GetActivities)
			activity.GET("/:id", handlers.GetActivity)
			activity.PUT("/:id", handlers.UpdateActivity)
			activity.DELETE("/:id", handlers.DeleteActivity)
		}

		categories := api.Group("/categories")
		{
			categories.POST("", handlers.CreateCategory)
			categories.GET("", handlers.GetCategories)
			categories.GET("/:id", handlers.GetCategory)
			categories.PUT("/:id", handlers.UpdateCategory)
			categories.DELETE("/:id", handlers.DeleteCategory)
		}

		tags := api.Group("/tags")
		{
			tags.POST("", handlers.CreateTag)
			tags.GET("", handlers.GetTags)
			tags.GET("/:id", handlers.GetTag)
			tags.PUT("/:id", handlers.UpdateTag)
			tags.DELETE("/:id", handlers.DeleteTag)
		}
	}

	return r
}
