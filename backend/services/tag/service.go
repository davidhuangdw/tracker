package tag

type TagService interface {
	CreateTag(tag *Tag) error
	GetTagByID(id int) (*Tag, error)
	GetTagsByUserID(userID int) ([]Tag, error)
	UpdateTag(tag *Tag) error
	DeleteTag(id int) error
}
