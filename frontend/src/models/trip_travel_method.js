//create for our project

export class TripTravelMethod {
    constructor(trip_id, travel_method_id, departure, arrival, price){
        this.trip_id = trip_id;
        this.travel_method_id = travel_method_id;
        this.departure = departure;
        this.arrival = arrival;
        this.price = price;
    }
}
export default TripTravelMethod;