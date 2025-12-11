package timetrack

import (
	"database/sql"
	"time"

	"example.com/tracker/internal/infrastructure/db"
)

type Repository interface {
	// Activity methods
	CreateActivity(activity *Activity) error
	GetActivityByID(id int) (*Activity, error)
	GetActivitiesByUserID(userID int, from, to time.Time) ([]Activity, error)
	UpdateActivity(activity *Activity) error
	DeleteActivity(id int) error

	// Category methods
	CreateCategory(category *Category) error
	GetCategoryByID(id int) (*Category, error)
	GetCategoriesByUserID(userID int) ([]Category, error)
	UpdateCategory(category *Category) error
	DeleteCategory(id int) error

	// Tag methods
	CreateTag(tag *Tag) error
	GetTagByID(id int) (*Tag, error)
	GetTagsByUserID(userID int) ([]Tag, error)
	UpdateTag(tag *Tag) error
	DeleteTag(id int) error
}

type repository struct {
	db *sql.DB
}

func NewRepository() Repository {
	return &repository{
		db: db.DB,
	}
}

// Activity methods
func (r *repository) CreateActivity(activity *Activity) error {
	query := `INSERT INTO activities (user_id, from_time, to_time, name, category_id) VALUES (?, ?, ?, ?, ?) RETURNING id, created_at, updated_at`
	return r.db.QueryRow(query, activity.UserID, activity.From, activity.To, activity.Name, activity.CategoryID).Scan(&activity.ID, &activity.CreatedAt, &activity.UpdatedAt)
}

func (r *repository) GetActivityByID(id int) (*Activity, error) {
	query := `SELECT id, user_id, from_time, to_time, name, category_id, created_at, updated_at FROM activities WHERE id = ?`
	activity := &Activity{}
	err := r.db.QueryRow(query, id).Scan(&activity.ID, &activity.UserID, &activity.From, &activity.To, &activity.Name, &activity.CategoryID, &activity.CreatedAt, &activity.UpdatedAt)
	if err != nil {
		return nil, err
	}

	// Get tags for activity
	activity.Tags, err = r.getTagsForActivity(id)
	if err != nil {
		return nil, err
	}

	return activity, nil
}

func (r *repository) GetActivitiesByUserID(userID int, from, to time.Time) ([]Activity, error) {
	query := `SELECT id, user_id, from_time, to_time, name, category_id, created_at, updated_at FROM activities WHERE user_id = ? AND from_time >= ? AND to_time <= ? ORDER BY from_time`
	rows, err := r.db.Query(query, userID, from, to)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []Activity
	for rows.Next() {
		activity := &Activity{}
		err := rows.Scan(&activity.ID, &activity.UserID, &activity.From, &activity.To, &activity.Name, &activity.CategoryID, &activity.CreatedAt, &activity.UpdatedAt)
		if err != nil {
			return nil, err
		}

		// Get tags for activity
		activity.Tags, err = r.getTagsForActivity(activity.ID)
		if err != nil {
			return nil, err
		}

		activities = append(activities, *activity)
	}

	return activities, nil
}

func (r *repository) UpdateActivity(activity *Activity) error {
	query := `UPDATE activities SET from_time = ?, to_time = ?, name = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
	_, err := r.db.Exec(query, activity.From, activity.To, activity.Name, activity.CategoryID, activity.ID)
	if err != nil {
		return err
	}

	// Update tags
	if err := r.updateTagsForActivity(activity.ID, activity.Tags); err != nil {
		return err
	}

	return nil
}

func (r *repository) DeleteActivity(id int) error {
	// Delete activity tags first
	if _, err := r.db.Exec(`DELETE FROM activity_tags WHERE activity_id = ?`, id); err != nil {
		return err
	}

	// Delete activity
	_, err := r.db.Exec(`DELETE FROM activities WHERE id = ?`, id)
	return err
}

// Category methods
func (r *repository) CreateCategory(category *Category) error {
	query := `INSERT INTO categories (user_id, name, color, description) VALUES (?, ?, ?, ?) RETURNING id, created_at, updated_at`
	return r.db.QueryRow(query, category.UserID, category.Name, category.Color, category.Description).Scan(&category.ID, &category.CreatedAt, &category.UpdatedAt)
}

func (r *repository) GetCategoryByID(id int) (*Category, error) {
	query := `SELECT id, user_id, name, color, description, created_at, updated_at FROM categories WHERE id = ?`
	category := &Category{}
	err := r.db.QueryRow(query, id).Scan(&category.ID, &category.UserID, &category.Name, &category.Color, &category.Description, &category.CreatedAt, &category.UpdatedAt)
	return category, err
}

func (r *repository) GetCategoriesByUserID(userID int) ([]Category, error) {
	query := `SELECT id, user_id, name, color, description, created_at, updated_at FROM categories WHERE user_id = ? ORDER BY name`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		category := &Category{}
		err := rows.Scan(&category.ID, &category.UserID, &category.Name, &category.Color, &category.Description, &category.CreatedAt, &category.UpdatedAt)
		if err != nil {
			return nil, err
		}
		categories = append(categories, *category)
	}

	return categories, nil
}

func (r *repository) UpdateCategory(category *Category) error {
	query := `UPDATE categories SET name = ?, color = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
	_, err := r.db.Exec(query, category.Name, category.Color, category.Description, category.ID)
	return err
}

func (r *repository) DeleteCategory(id int) error {
	_, err := r.db.Exec(`DELETE FROM categories WHERE id = ?`, id)
	return err
}

// Tag methods
func (r *repository) CreateTag(tag *Tag) error {
	query := `INSERT INTO tags (user_id, name, color, description) VALUES (?, ?, ?, ?) RETURNING id, created_at, updated_at`
	return r.db.QueryRow(query, tag.UserID, tag.Name, tag.Color, tag.Description).Scan(&tag.ID, &tag.CreatedAt, &tag.UpdatedAt)
}

func (r *repository) GetTagByID(id int) (*Tag, error) {
	query := `SELECT id, user_id, name, color, description, created_at, updated_at FROM tags WHERE id = ?`
	tag := &Tag{}
	err := r.db.QueryRow(query, id).Scan(&tag.ID, &tag.UserID, &tag.Name, &tag.Color, &tag.Description, &tag.CreatedAt, &tag.UpdatedAt)
	return tag, err
}

func (r *repository) GetTagsByUserID(userID int) ([]Tag, error) {
	query := `SELECT id, user_id, name, color, description, created_at, updated_at FROM tags WHERE user_id = ? ORDER BY name`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []Tag
	for rows.Next() {
		tag := &Tag{}
		err := rows.Scan(&tag.ID, &tag.UserID, &tag.Name, &tag.Color, &tag.Description, &tag.CreatedAt, &tag.UpdatedAt)
		if err != nil {
			return nil, err
		}
		tags = append(tags, *tag)
	}

	return tags, nil
}

func (r *repository) UpdateTag(tag *Tag) error {
	query := `UPDATE tags SET name = ?, color = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
	_, err := r.db.Exec(query, tag.Name, tag.Color, tag.Description, tag.ID)
	return err
}

func (r *repository) DeleteTag(id int) error {
	// Delete tag from activity_tags first
	if _, err := r.db.Exec(`DELETE FROM activity_tags WHERE tag_id = ?`, id); err != nil {
		return err
	}

	// Delete tag
	_, err := r.db.Exec(`DELETE FROM tags WHERE id = ?`, id)
	return err
}

// Helper methods
func (r *repository) getTagsForActivity(activityID int) ([]Tag, error) {
	query := `SELECT t.id, t.user_id, t.name, t.color, t.description, t.created_at, t.updated_at FROM tags t JOIN activity_tags at ON t.id = at.tag_id WHERE at.activity_id = ?`
	rows, err := r.db.Query(query, activityID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []Tag
	for rows.Next() {
		tag := &Tag{}
		err := rows.Scan(&tag.ID, &tag.UserID, &tag.Name, &tag.Color, &tag.Description, &tag.CreatedAt, &tag.UpdatedAt)
		if err != nil {
			return nil, err
		}
		tags = append(tags, *tag)
	}

	return tags, nil
}

func (r *repository) updateTagsForActivity(activityID int, tags []Tag) error {
	// Delete existing tags
	if _, err := r.db.Exec(`DELETE FROM activity_tags WHERE activity_id = ?`, activityID); err != nil {
		return err
	}

	// Insert new tags
	for _, tag := range tags {
		if _, err := r.db.Exec(`INSERT INTO activity_tags (activity_id, tag_id) VALUES (?, ?)`, activityID, tag.ID); err != nil {
			return err
		}
	}

	return nil
}