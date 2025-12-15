package impl

import (
	"net/http"
	"strconv"

	"example.com/tracker/domains/tag"
	"github.com/gin-gonic/gin"
)

type TagHandlerImpl struct {
	TagService tag.TagService
}

func NewTagHandler(tagService tag.TagService) tag.TagHandler {
	return &TagHandlerImpl{
		TagService: tagService,
	}
}

func (h *TagHandlerImpl) CreateTag(c *gin.Context) {
	var tag tag.Tag
	if err := c.ShouldBindJSON(&tag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tag.UserID = 1 // Default user ID

	if err := h.TagService.CreateTag(&tag); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, tag)
}

func (h *TagHandlerImpl) GetTag(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	tag, err := h.TagService.GetTagByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tag not found"})
		return
	}

	c.JSON(http.StatusOK, tag)
}

func (h *TagHandlerImpl) GetTags(c *gin.Context) {
	userID := 1 // Default user ID

	tags, err := h.TagService.GetTagsByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tags)
}

func (h *TagHandlerImpl) UpdateTag(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var tag tag.Tag
	if err := c.ShouldBindJSON(&tag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tag.ID = id
	tag.UserID = 1 // Default user ID

	if err := h.TagService.UpdateTag(&tag); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tag)
}

func (h *TagHandlerImpl) DeleteTag(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.TagService.DeleteTag(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
