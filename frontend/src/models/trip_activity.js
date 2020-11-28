//create for our project

export class TripActivity {
    constructor(trip_id, activity_type_id, name, location, arrival, departure, price){
        this.trip_id = trip_id;
        this.activity_type_id = activity_type_id;
        this.name = name;
        this.location = location;
        this.arrival = arrival;
        this.departure = departure;
        this.price = price;
    }
}
export default TripActivity;