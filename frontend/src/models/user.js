//use for our project

export class User {
    constructor(id, name, location, bio, email, password, date_joined, profilePicUrl){
        this.id = id;
        this.name = name;
        this.location = location;
        this.bio = bio;
        this.email = email;
        this.password = password;
        this.date_joined = date_joined;
        //not in schema currently
        this.profilePicUrl = profilePicUrl;
    }
}
export default User;
