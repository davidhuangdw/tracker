package router

import (
	"example.com/tracker/internal/application/timetrack"
	"github.com/gin-gonic/gin"
)

func SetupRouter(timetrackHandlers *timetrack.Handlers) *gin.Engine {
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
			activity.POST("", timetrackHandlers.CreateActivity)
			activity.GET("", timetrackHandlers.GetActivities)
			activity.GET("/:id", timetrackHandlers.GetActivity)
			activity.PUT("/:id", timetrackHandlers.UpdateActivity)
			activity.DELETE("/:id", timetrackHandlers.DeleteActivity)
		}

		categories := api.Group("/categories")
		{
			categories.POST("", timetrackHandlers.CreateCategory)
			categories.GET("", timetrackHandlers.GetCategories)
			categories.GET("/:id", timetrackHandlers.GetCategory)
			categories.PUT("/:id", timetrackHandlers.UpdateCategory)
			categories.DELETE("/:id", timetrackHandlers.DeleteCategory)
		}

		tags := api.Group("/tags")
		{
			tags.POST("", timetrackHandlers.CreateTag)
			tags.GET("", timetrackHandlers.GetTags)
			tags.GET("/:id", timetrackHandlers.GetTag)
			tags.PUT("/:id", timetrackHandlers.UpdateTag)
			tags.DELETE("/:id", timetrackHandlers.DeleteTag)
		}
	}

	return r
}