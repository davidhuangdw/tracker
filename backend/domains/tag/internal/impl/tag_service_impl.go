package impl

import (
	"database/sql"

	"example.com/tracker/domains/tag"
)

type TagServiceImpl struct {
	DB *sql.DB
}

func (s *TagServiceImpl) CreateTag(tag *tag.Tag) error {
	query := `INSERT INTO tags (user_id, name, color, description) VALUES (?, ?, ?, ?) RETURNING id, created_at, updated_at`
	return s.DB.QueryRow(query, tag.UserID, tag.Name, tag.Color, tag.Description).Scan(&tag.ID, &tag.CreatedAt, &tag.UpdatedAt)
}

func (s *TagServiceImpl) GetTagByID(id int) (*tag.Tag, error) {
	query := `SELECT id, user_id, name, color, description, created_at, updated_at FROM tags WHERE id = ?`
	tag := &tag.Tag{}
	err := s.DB.QueryRow(query, id).Scan(&tag.ID, &tag.UserID, &tag.Name, &tag.Color, &tag.Description, &tag.CreatedAt, &tag.UpdatedAt)
	return tag, err
}

func (s *TagServiceImpl) GetTagsByUserID(userID int) ([]tag.Tag, error) {
	query := `SELECT id, user_id, name, color, description, created_at, updated_at FROM tags WHERE user_id = ? ORDER BY name`
	rows, err := s.DB.Query(query, userID)
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

func (s *TagServiceImpl) UpdateTag(tag *tag.Tag) error {
	query := `UPDATE tags SET name = ?, color = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
	_, err := s.DB.Exec(query, tag.Name, tag.Color, tag.Description, tag.ID)
	return err
}

func (s *TagServiceImpl) DeleteTag(id int) error {
	// Delete tag from activity_tags first
	if _, err := s.DB.Exec(`DELETE FROM activity_tags WHERE tag_id = ?`, id); err != nil {
		return err
	}

	// Delete tag
	_, err := s.DB.Exec(`DELETE FROM tags WHERE id = ?`, id)
	return err
}
