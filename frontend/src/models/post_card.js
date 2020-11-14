export class post_card{
    constructor(post_id,user_id,username,date,origin,destination,imgurl,text,price,reaction,rating,comments){
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
    }
}
export default post_card;