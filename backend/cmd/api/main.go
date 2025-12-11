package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"runtime/debug"
	"syscall"
	"time"

	domain "example.com/tracker/internal/application/timetrack"
	"example.com/tracker/internal/domain/timetrack"
	"example.com/tracker/internal/infrastructure/db"
	"example.com/tracker/internal/infrastructure/router"
	"github.com/gin-gonic/gin"
)

func CustomRecovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				// 记录详细的错误信息，包括堆栈
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

func main() {
	// Initialize database
	if err := db.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.CloseDB()

	// Initialize database schema
	if err := db.InitSchema(); err != nil {
		log.Fatalf("Failed to initialize database schema: %v", err)
	}

	// Initialize dependencies
	timetrackRepo := timetrack.NewRepository()
	timetrackService := domain.NewService(timetrackRepo)
	timetrackHandlers := domain.NewHandlers(timetrackService)

	// Setup router
	r := router.SetupRouter(timetrackHandlers)
	r.Use(CustomRecovery())

	// 添加请求日志中间件
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

	// Create server with timeout settings
	server := &http.Server{
		Addr:         ":8080",
		Handler:      r,
		ReadTimeout:  10 * time.Second, // 读取请求头的超时时间
		WriteTimeout: 10 * time.Second, // 写入响应的超时时间
		IdleTimeout:  20 * time.Second, // 空闲连接的超时时间
	}

	// Start server with graceful shutdown
	log.Println("Server starting on port 8080 with improved concurrency...")

	// 启动服务器
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// 等待中断信号
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// 优雅关闭
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited")
}
