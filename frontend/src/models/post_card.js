export class post_card{
    constructor(post_id,user_id,username,date,origin,destination,imgurl,text,price,reaction,rating,comments,curr_user_liked, numlikes,curr_user_saved){
        this.post_id = post_id;
        this.user_id = user_id;
        this.username = username;
        this.date = date;
        this.origin = origin;
        this.destination = destination;
        this.imgurl = imgurl;
        this.text = text;
        this.price = price;
        this.reaction = reaction;
        this.rating = rating;
        this.comments = comments;
        this.curr_user_liked = curr_user_liked;
        this.numlikes = numlikes;
        this.curr_user_saved = curr_user_saved;
    }
}
export default post_card;