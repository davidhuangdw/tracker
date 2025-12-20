package router

import (
	"log"

	"example.com/tracker/internal/config"
	"github.com/gin-gonic/gin"
)

func SetupRouter(handlers Handlers) *gin.Engine {
	r := gin.Default()

	r.Use(WithCORS)

	// API routes
	api := r.Group("/api")
	{
		// Activity routes
		activity := api.Group("/activities")
		{
			activity.POST("", handlers.CreateActivity)
			activity.GET("", handlers.GetActivities)
			activity.GET("/:id", handlers.GetActivity)
			activity.PUT("/:id", handlers.UpdateActivity)
			activity.DELETE("/:id", handlers.DeleteActivity)
		}

		// ActivityTag routes
		activityTag := api.Group("/activity-tags")
		{
			activityTag.POST("", handlers.CreateActivityTag)
			activityTag.GET("/activity/:activity_id", handlers.GetActivityTagsByActivityID)
			activityTag.GET("/tag/:tag_id", handlers.GetActivityTagsByTagID)
			activityTag.DELETE("/activity/:activity_id/tag/:tag_id", handlers.DeleteActivityTag)
		}

		// Category routes
		categories := api.Group("/categories")
		{
			categories.POST("", handlers.CreateCategory)
			categories.GET("", handlers.GetCategories)
			categories.GET("/:id", handlers.GetCategory)
			categories.PUT("/:id", handlers.UpdateCategory)
			categories.DELETE("/:id", handlers.DeleteCategory)
		}

		// Tag routes
		tags := api.Group("/tags")
		{
			tags.POST("", handlers.CreateTag)
			tags.GET("", handlers.GetTags)
			tags.GET("/:id", handlers.GetTag)
			tags.PUT("/:id", handlers.UpdateTag)
			tags.DELETE("/:id", handlers.DeleteTag)
		}

		// Aggr routes
		aggr := api.Group("/aggr")
		{
			aggr.POST("", handlers.CreateAggr)
			aggr.GET("", handlers.GetAggrs)
			aggr.GET("/:id", handlers.GetAggr)
			aggr.PUT("/:id", handlers.UpdateAggr)
			aggr.DELETE("/:id", handlers.DeleteAggr)
		}
	}

	return r
}

func StartServer(handlers Handlers) error {
	cfg := config.GetConfig()

	if !cfg.App.Debug {
		gin.SetMode(gin.ReleaseMode)
	}

	// Setup routes using the provided handlers
	r := SetupRouter(handlers)

	port := cfg.App.Port
	if port == "" {
		port = ":8080"
	}

	log.Printf("Starting server on %s", port)
	return r.Run(port)
}