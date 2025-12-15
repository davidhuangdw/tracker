package impl

import (
	"net/http"
	"strconv"
	"time"

	"example.com/tracker/domains/activity"
	"github.com/gin-gonic/gin"
)

type ActivityHandlerImpl struct {
	ActivityService activity.ActivityService
}

func (h *ActivityHandlerImpl) CreateActivity(c *gin.Context) {
	var activity activity.Activity
	if err := c.ShouldBindJSON(&activity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set default user ID for now
	activity.UserID = 1

	if err := h.ActivityService.CreateActivity(&activity); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, activity)
}

func (h *ActivityHandlerImpl) GetActivity(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	activity, err := h.ActivityService.GetActivityByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Activity not found"})
		return
	}

	c.JSON(http.StatusOK, activity)
}

func (h *ActivityHandlerImpl) GetActivities(c *gin.Context) {
	userID := 1 // Default user ID

	// Parse from and to parameters
	fromStr := c.Query("from")
	toStr := c.Query("to")

	from, err := time.Parse(time.RFC3339, fromStr)
	if err != nil {
		from = time.Now().AddDate(0, 0, -7) // Default to 7 days ago
	}

	to, err := time.Parse(time.RFC3339, toStr)
	if err != nil {
		to = time.Now() // Default to now
	}

	activities, err := h.ActivityService.GetActivitiesByUserID(userID, from, to)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, activities)
}

func (h *ActivityHandlerImpl) UpdateActivity(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var activity activity.Activity
	if err := c.ShouldBindJSON(&activity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	activity.ID = id
	activity.UserID = 1 // Default user ID

	if err := h.ActivityService.UpdateActivity(&activity); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, activity)
}

func (h *ActivityHandlerImpl) DeleteActivity(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.ActivityService.DeleteActivity(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
