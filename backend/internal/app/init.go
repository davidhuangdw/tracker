package app

import (
	"fmt"
	"log"
	"net/http"
	"runtime/debug"
	"time"

	"example.com/tracker/internal/infra/db"
	"example.com/tracker/internal/infra/router"
	"example.com/tracker/services/activity/activity_builder"
	"example.com/tracker/services/category/category_builder"
	"example.com/tracker/services/tag/tag_builder"
	"github.com/gin-gonic/gin"
)

func InitApp() (*http.Server, error) {
	if err := db.InitDB(); err != nil {
		return nil, err
	}

	if err := db.InitSchema(); err != nil {
		return nil, err
	}

	activityService := activity_builder.NewActivityService(db.DB)
	categoryService := category_builder.NewCategoryService(db.DB)
	tagService := tag_builder.NewTagService(db.DB)

	handler := &router.Handlers{
		activity_builder.NewActivityHandler(activityService),
		category_builder.NewCategoryHandler(categoryService),
		tag_builder.NewTagHandler(tagService),
	}

	r := router.SetupRouter(*handler)

	r.Use(CustomRecovery())
	r.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("[%s] %s %s %d %s \"%s\"\n",
			param.TimeStamp.Format(time.RFC3339),
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
			param.ErrorMessage,
		)
	}))

	server := &http.Server{
		Addr:         ":8080",
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  20 * time.Second,
	}

	return server, nil
}

func CleanupApp() {
	db.CloseDB()
}

func CustomRecovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				// Log detailed error information including stack trace
				log.Printf("Panic recovered: %v\n", err)
				log.Printf("Stack trace: %s\n", string(debug.Stack()))

				c.AbortWithStatusJSON(500, gin.H{
					"message": "Internal server error",
					"error":   fmt.Sprintf("%v", err),
				})
			}
		}()
		c.Next()
	}
}