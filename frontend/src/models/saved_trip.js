//create for our project

export class SavedTrip {
    constructor(trip_id, saved_by_user, save_ranking){
        this.trip_id = trip_id;
        this.saved_by_user = saved_by_user;
        this.save_ranking = save_ranking;
    }
}
export default SavedTrip;