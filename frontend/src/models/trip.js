//for our trip

export class Trip {
    constructor(id, user_id, title, body, price, origin, destination, rating, sentiment_id, is_public, date_created, date_last_updated){
        this.id = id;
        this.user_id = user_id;
        this.title = title;
        this.body = body;
        this.price = price;
        this.origin = origin;
        this.destination = destination;
        this.rating = rating;
        this.sentiment_id = sentiment_id;
        this.is_public = is_public;
        this.date_created = date_created;
        this.date_last_updated = date_last_updated;
    }
}
export default Trip;