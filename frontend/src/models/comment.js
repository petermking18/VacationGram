//create for our project

export class Comment {
    constructor(id, trip_id, user_id, parent_comment_id, is_question, date_created){
        this.id = id;
        this.trip_id = trip_id;
        this.user_id = user_id;
        this.parent_comment_id = parent_comment_id;
        this.is_question = is_question;
        this.date_created = date_created;
    }
}
export default Comment;