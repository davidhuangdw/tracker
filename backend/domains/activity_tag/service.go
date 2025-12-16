package activity_tag

type ActivityTagService interface {
	CreateActivityTag(activityTag *ActivityTag) error
	GetActivityTagsByActivityID(activityID uint) ([]ActivityTag, error)
	GetActivityTagsByTagID(tagID uint) ([]ActivityTag, error)
	DeleteActivityTag(activityID, tagID uint) error
	DeleteActivityTagsByActivityID(activityID uint) error
	DeleteActivityTagsByTagID(tagID uint) error
}
