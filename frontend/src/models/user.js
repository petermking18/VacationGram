//use for our project

export class User {
    constructor(id, username, email, password, profilePicUrl){
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        //not in schema currently
        this.profilePicUrl = profilePicUrl;
    }
}
export default User;
