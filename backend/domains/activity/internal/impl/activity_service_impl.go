package impl

import (
	"database/sql"
	"time"

	"example.com/tracker/domains/activity"
	"example.com/tracker/domains/tag"
)

type ActivityServiceImpl struct {
	*sql.DB
}

func (s *ActivityServiceImpl) CreateActivity(activity *activity.Activity) error {
	query := `INSERT INTO activities (user_id, from_time, to_time, name, category_id) VALUES (?, ?, ?, ?, ?) RETURNING id, created_at, updated_at`
	return s.QueryRow(query, activity.UserID, activity.From, activity.To, activity.Name, activity.CategoryID).Scan(&activity.ID, &activity.CreatedAt, &activity.UpdatedAt)
}

func (s *ActivityServiceImpl) GetActivityByID(id int) (*activity.Activity, error) {
	query := `SELECT id, user_id, from_time, to_time, name, category_id, created_at, updated_at FROM activities WHERE id = ?`
	activity := &activity.Activity{}
	err := s.QueryRow(query, id).Scan(&activity.ID, &activity.UserID, &activity.From, &activity.To, &activity.Name, &activity.CategoryID, &activity.CreatedAt, &activity.UpdatedAt)
	if err != nil {
		return nil, err
	}

	// Get tags for activity
	activity.Tags, err = s.getTagsForActivity(id)
	if err != nil {
		return nil, err
	}

	return activity, nil
}

func (s *ActivityServiceImpl) GetActivitiesByUserID(userID int, from, to time.Time) ([]activity.Activity, error) {
	query := `SELECT id, user_id, from_time, to_time, name, category_id, created_at, updated_at FROM activities WHERE user_id = ? AND from_time >= ? AND to_time <= ? ORDER BY from_time`
	rows, err := s.Query(query, userID, from, to)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []activity.Activity
	for rows.Next() {
		activity := &activity.Activity{}
		err := rows.Scan(&activity.ID, &activity.UserID, &activity.From, &activity.To, &activity.Name, &activity.CategoryID, &activity.CreatedAt, &activity.UpdatedAt)
		if err != nil {
			return nil, err
		}

		// Get tags for activity
		activity.Tags, err = s.getTagsForActivity(activity.ID)
		if err != nil {
			return nil, err
		}

		activities = append(activities, *activity)
	}

	return activities, nil
}

func (s *ActivityServiceImpl) UpdateActivity(activity *activity.Activity) error {
	query := `UPDATE activities SET from_time = ?, to_time = ?, name = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
	_, err := s.Exec(query, activity.From, activity.To, activity.Name, activity.CategoryID, activity.ID)
	if err != nil {
		return err
	}

	// Update tags
	if err := s.updateTagsForActivity(activity.ID, activity.Tags); err != nil {
		return err
	}

	return nil
}

func (s *ActivityServiceImpl) DeleteActivity(id int) error {
	// Delete activity tags first
	if _, err := s.Exec(`DELETE FROM activity_tags WHERE activity_id = ?`, id); err != nil {
		return err
	}

	// Delete activity
	_, err := s.Exec(`DELETE FROM activities WHERE id = ?`, id)
	return err
}

// Helper methods
func (s *ActivityServiceImpl) getTagsForActivity(activityID int) ([]tag.Tag, error) {
	query := `SELECT t.id, t.user_id, t.name, t.color, t.description, t.created_at, t.updated_at FROM tags t JOIN activity_tags at ON t.id = at.tag_id WHERE at.activity_id = ?`
	rows, err := s.Query(query, activityID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []tag.Tag
	for rows.Next() {
		tag := &tag.Tag{}
		err := rows.Scan(&tag.ID, &tag.UserID, &tag.Name, &tag.Color, &tag.Description, &tag.CreatedAt, &tag.UpdatedAt)
		if err != nil {
			return nil, err
		}
		tags = append(tags, *tag)
	}

	return tags, nil
}

func (s *ActivityServiceImpl) updateTagsForActivity(activityID int, tags []tag.Tag) error {
	// Delete existing tags
	if _, err := s.Exec(`DELETE FROM activity_tags WHERE activity_id = ?`, activityID); err != nil {
		return err
	}

	// Insert new tags
	for _, tag := range tags {
		if _, err := s.Exec(`INSERT INTO activity_tags (activity_id, tag_id) VALUES (?, ?)`, activityID, tag.ID); err != nil {
			return err
		}
	}

	return nil
}
