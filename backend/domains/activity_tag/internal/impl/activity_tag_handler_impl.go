package impl

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"example.com/tracker/domains/activity_tag"
)

type ActivityTagHandlerImpl struct {
	ActivityTagService activity_tag.ActivityTagService
}

func (h *ActivityTagHandlerImpl) CreateActivityTag(c *gin.Context) {
	var activityTag activity_tag.ActivityTag
	if err := c.ShouldBindJSON(&activityTag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.ActivityTagService.CreateActivityTag(&activityTag); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, activityTag)
}

func (h *ActivityTagHandlerImpl) GetActivityTagsByActivityID(c *gin.Context) {
	activityID := c.Param("activity_id")
	if activityID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "activity_id is required"})
		return
	}

	var activityIDUint uint
	if _, err := fmt.Sscanf(activityID, "%d", &activityIDUint); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid activity_id"})
		return
	}

	activityTags, err := h.ActivityTagService.GetActivityTagsByActivityID(activityIDUint)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, activityTags)
}

func (h *ActivityTagHandlerImpl) GetActivityTagsByTagID(c *gin.Context) {
	tagID := c.Param("tag_id")
	if tagID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tag_id is required"})
		return
	}

	var tagIDUint uint
	if _, err := fmt.Sscanf(tagID, "%d", &tagIDUint); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag_id"})
		return
	}

	activityTags, err := h.ActivityTagService.GetActivityTagsByTagID(tagIDUint)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, activityTags)
}

func (h *ActivityTagHandlerImpl) DeleteActivityTag(c *gin.Context) {
	activityID := c.Param("activity_id")
	tagID := c.Param("tag_id")
	if activityID == "" || tagID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "activity_id and tag_id are required"})
		return
	}

	var activityIDUint, tagIDUint uint
	if _, err := fmt.Sscanf(activityID, "%d", &activityIDUint); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid activity_id"})
		return
	}
	if _, err := fmt.Sscanf(tagID, "%d", &tagIDUint); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag_id"})
		return
	}

	if err := h.ActivityTagService.DeleteActivityTag(activityIDUint, tagIDUint); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "activity tag deleted successfully"})
}
