import React from 'react';
import { Feed } from './Feed';
import { post_card } from '../models/post_card';
import { Comment } from '../models/comment';
import { Redirect, Link } from 'react-router-dom';
import './Home.css';
import NavBar from './navBar';
import PostForm from './PostForm';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export class Home extends React.Component {
    dummyPost1 = new post_card (1, 2, "Mark Fontenot", "Nov 9 2020",
     "Dallas", "Hawaii", "https://www.smu.edu/-/media/Images/News/Experts/Mark-Fontenot.jpg?la=en",
     "Today, I went snorkeling and then I went hiking and then I built a sand castle and then I ................ ............... ......... .............. .................... .................. ........ ........... .............. ............. .............",
     "$$$", "happy", "4 stars", [] );
     dummyComment1 = new Comment (1, 1, 1, 1, false, "Nov 11 2020");
     dummyPost2 = new post_card (2, 1, "Peter King", "Nov 10 2020",
     "Texas", "Washington, DC", "https://dcist.com/wp-content/uploads/sites/3/2020/07/washington-monument-5266903_1920-1500x1000.jpg", 
     "I walked around the National Mall and saw some cool buildings!",
     "$$$$$", "fun", "3 stars", [this.dummyComment1] );
    
    posts = [this.dummyPost1,this.dummyPost2,this.dummyPost1];

    constructor(props){
        super(props)
        this.state = {
            user_id: '1234',//keep track of logged in user somehow
            username: "Dummy User",//get username somehow
            postForm: false,
            origin: "",
            destination: "",
            imgurl: "",
            text: "",
            price: "",
            reaction: "",
            rating: ""
        }
    }

    prices = ["$","$$","$$$","$$$$","$$$$$"];
    ratings = ["1 star","2 stars","3 stars","4 stars","5 stars"];
    reactions = ["fun","boring","exciting","scary"]
    postFormOpen(){
        this.setState({postForm:true});
        document.body.style.overflow = "hidden";
    }
    postFormClose(){
        this.setState({postForm:false});
        this.setState({origin: ""});
        this.setState({destination: ""});
        this.setState({imgurl: ""});
        this.setState({text: ""});
        this.setState({price: ""});
        this.setState({reaction: ""});
        this.setState({rating: ""});
        document.body.style.overflow = "visible";
    }
    onPost(){
        let dateObj = new Date();
        let date = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
        let mypost = new post_card(
            null, this.state.user_id, this.state.username, date, this.state.origin, this.state.destination, this.state.imgurl,
            this.state.text, this.state.price, this.state.reaction, this.state.rating, [] 
        );
        this.posts.unshift(mypost);//later this step will post to database
        this.postFormClose();
    }
    onLoad(){

    }

    render() {
        this.onLoad();
        return (
            <>
            <NavBar id={this.props.match.params.id}/>
            <button id="newpostbutton" type="button" onClick={e => this.postFormOpen(e)}>
                New Post
            </button>
            <Feed thePosts={this.posts}></Feed>

            <PostForm show={this.state.postForm} handleClose={e => this.postFormClose(e)}>
                <div className="mt-3 pt-4">
                    <h2>Make a Post</h2>
                    <form className="pr-5" id="newpostform">
                        <div className="row">
                            <div className="col">
                                <label htmlFor="origin">Origin of Trip</label>
                                <input className="form-control" type="text" id="origin" 
                                value={this.state.origin} onChange={e => this.setState({origin: e.target.value})} required/>
                            </div>
                            <div className="col">
                                <label htmlFor="dest">Destination of Trip</label>
                                <input className="form-control" type="text" id="dest"
                                value={this.state.destination} onChange={e => this.setState({destination: e.target.value})} required/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="text">Describe your Trip</label>
                                <textarea className="form-control" id="text" rows="5"
                                value={this.state.text} onChange={e => this.setState({text: e.target.value})} required/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="price">How expensive was it?</label>
                                <select className="form-control" id="price" value={this.state.price}
                                onChange={e => this.setState({price: e.target.value})} required>
                                    <option></option>
                                    {this.prices.map((x,i) => <option key={i}>{x}</option>)}
                                </select>
                            </div>
                            <div className="col">
                                <label htmlFor="rating">Rate your Trip</label>
                                <select className="form-control" id="rating" value={this.state.rating}
                                onChange={e => this.setState({rating: e.target.value})} required>
                                    <option></option>
                                    {this.ratings.map((x,i) => <option key={i}>{x}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="imgurl">Add a Photo (URL)</label>
                                <input className="form-control" type="text" id="imgurl"
                                value={this.state.imgurl} onChange={e => this.setState({imgurl: e.target.value})} required/>
                            </div>
                            <div className="col">
                                <label htmlFor="reaction">Reaction to Trip</label>
                                <select className="form-control" id="reaction" value={this.state.reaction}
                                onChange={e => this.setState({reaction: e.target.value})} required>
                                    <option></option>
                                    {this.reactions.map((x,i) => <option key={i}>{x}</option>)}
                                </select>
                            </div>
                        </div>
                        <button type="button" className="btn" id="postButton" onClick={() => this.onPost()}>Post</button>
                    </form>
                </div>
            </PostForm>
            </>
        );
    }
}
export default Home;