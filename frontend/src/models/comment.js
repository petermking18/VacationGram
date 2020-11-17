export class Comment {
    constructor(id, trip_id, user_id, username, parent_comment_id, is_question, date_created, text, numlikes, curr_user_liked){
        this.id = id;
        this.trip_id = trip_id;
        this.user_id = user_id;
        this.username = username;
        this.parent_comment_id = parent_comment_id;
        this.is_question = is_question;
        this.date_created = date_created;
        this.text = text;
        this.numlikes = numlikes;
        this.curr_user_liked = curr_user_liked;
    }
}
export default Comment;