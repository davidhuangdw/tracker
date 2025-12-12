package impl

import (
	"net/http"
	"strconv"

	"example.com/tracker/services/category"
	"github.com/gin-gonic/gin"
)

type CategoryHandlerImpl struct {
	CategoryService category.CategoryService
}

func NewCategoryHandler(categoryService category.CategoryService) category.CategoryHandler {
	return &CategoryHandlerImpl{
		CategoryService: categoryService,
	}
}

func (h *CategoryHandlerImpl) CreateCategory(c *gin.Context) {
	var category category.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category.UserID = 1 // Default user ID

	if err := h.CategoryService.CreateCategory(&category); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, category)
}

func (h *CategoryHandlerImpl) GetCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	category, err := h.CategoryService.GetCategoryByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "CategoryManagement not found"})
		return
	}

	c.JSON(http.StatusOK, category)
}

func (h *CategoryHandlerImpl) GetCategories(c *gin.Context) {
	userID := 1 // Default user ID

	categories, err := h.CategoryService.GetCategoriesByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, categories)
}

func (h *CategoryHandlerImpl) UpdateCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var category category.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category.ID = id
	category.UserID = 1 // Default user ID

	if err := h.CategoryService.UpdateCategory(&category); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, category)
}

func (h *CategoryHandlerImpl) DeleteCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.CategoryService.DeleteCategory(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
