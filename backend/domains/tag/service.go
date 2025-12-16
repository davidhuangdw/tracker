package tag

type TagService interface {
	CreateTag(tag *Tag) error
	GetTagByID(id uint) (*Tag, error)
	GetTags() ([]Tag, error)
	UpdateTag(tag *Tag) error
	DeleteTag(id uint) error
}