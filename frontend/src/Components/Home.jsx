import React from 'react';
import PostFeed from './PostFeed';
import { post_card } from '../models/post_card';
import { Comment } from '../models/comment';
import { Redirect, Link } from 'react-router-dom';
import './Home.css';
import NavBar from './navBar';
import PostForm from './PostForm';
import PostModal from './PostModal';
import { Rating } from './Rating';
import { Price } from './Price';
import { CommentList } from './CommentList';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export class Home extends React.Component {
    dummyComment1 = new Comment(1, 1, 1, "Pete", 1, false, "Nov 11 2020", "Very cool trip!", 5);
    dummyComment2 = new Comment(2, 2, 2, "John Lawrimore", 2, false, "Nov 12 2020", "Seems like you had fun", 2);
    dummyPost1 = new post_card(1, 2, "Mark Fontenot", "Nov 9 2020",
        "Dallas", "Hawaii", "https://www.smu.edu/-/media/Images/News/Experts/Mark-Fontenot.jpg?la=en",
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "$$$", "happy", "4 stars", [this.dummyComment1, this.dummyComment2, this.dummyComment1, this.dummyComment2], true, 12, false);
    dummyPost2 = new post_card(2, 1, "Peter King", "Nov 10 2020",
        "Texas", "Washington, DC", "https://dcist.com/wp-content/uploads/sites/3/2020/07/washington-monument-5266903_1920-1500x1000.jpg",
        "I walked around the National Mall and saw some cool buildings!",
        "$$$$$", "fun", "3 stars", [this.dummyComment1, this.dummyComment2], false, 1, true);

    dummyPosts = [this.dummyPost1, this.dummyPost2, this.dummyPost1];
    blankPost = new post_card(
        0, 0, "", "", "", "", "", "", "", "", "", [], false, 0, false
    );

    constructor(props) {
        super(props)
        this.checkEsc = this.checkEsc.bind(this);
        this.state = {
            user_id: this.props.location.user_id,
            username: this.props.location.username,
            email: this.props.location.email,
            password: this.props.location.password,
            postForm: false,
            origin: "",
            destination: "",
            imgurl: "",
            text: "",
            price: "",
            reaction: "",
            rating: "",
            newComment: "",
            postModal: false,
            modalPost: this.blankPost,
            modalPostLiked: false,
            modalPostNumLikes: 0,
            modalPostSaved: false,
            posts: this.dummyPosts,
        }
    }

    prices = ["$", "$$", "$$$", "$$$$", "$$$$$"];
    ratings = ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"];
    reactions = ["fun", "boring", "exciting", "scary"]

    postModalOpen = (post) => {
        this.setState({ postModal: true });
        this.setState({ modalPost: post });
        this.setState({modalPostLiked: post.curr_user_liked});
        this.setState({modalPostNumLikes: post.numlikes});
        this.setState({modalPostSaved: post.curr_user_saved});
        document.body.style.overflow = "hidden";
    }
    postModalClose = (posts) => {
        this.setState({postModal:false});
        this.setState({newComment:""});
        document.body.style.overflow="visible";
        this.setState({posts: this.state.posts});
    }

    postFormOpen() {
        this.setState({ postForm: true });
        document.body.style.overflow = "hidden";
    }
    postFormClose = () => {
        this.setState({ postForm: false });
        this.setState({ origin: "" });
        this.setState({ destination: "" });
        this.setState({ imgurl: "" });
        this.setState({ text: "" });
        this.setState({ price: "" });
        this.setState({ reaction: "" });
        this.setState({ rating: "" });
        document.body.style.overflow = "visible";
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    onPost() {
        let dateObj = new Date();
        let date = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
        let mypost = new post_card(
            null, this.state.user_id, this.state.username, date, this.state.origin, this.state.destination, this.state.imgurl,
            this.state.text, this.state.price, this.state.reaction, this.state.rating, [], false, 0
        );
        this.posts.unshift(mypost);//later this step will post to database
        this.postFormClose();
    }
    onNewComment() {
        let dateObj = new Date();
        let date = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
        let mycomment = new Comment(
            null/*change to new comment id*/, this.state.modalPost.id, this.state.user_id, this.state.username,
            null/*parent id?*/, null/*is question?*/, date, this.state.newComment, 0
        );
        this.state.modalPost.comments.unshift(mycomment);
        this.postModalClose();
        this.postModalOpen(this.state.modalPost);
    }
    scrollToAddComment = () => {
        document.newCommentForm.newCommentTA.focus();
        document.getElementById("newcommenttextarea").scrollIntoView();
    }
    onClickFeedCommentButton = (post) => {
        this.postModalOpen(post);
        this.scrollToAddComment();
    }
    onClickFeedLikeButton = (post) => {
        if(post.curr_user_liked){
            //unlike in database
            post.curr_user_liked = false;
            post.numlikes--;
            this.setState({modalPostLiked: false});
            this.setState({modalPostNumLikes: this.state.modalPostNumLikes-1});
        }else{
            //like in database
            post.curr_user_liked = true;
            post.numlikes++;
            this.setState({modalPostLiked: true});
            this.setState({modalPostNumLikes: this.state.modalPostNumLikes+1});
        }
    }
    onClickSaveButton = (post) =>{
        if(post.curr_user_saved){
            //unsave in database
            post.curr_user_saved = false;
            this.setState({modalPostSaved: false});
        }else{
            //save in database
            post.curr_user_saved = true;
            this.setState({modalPostSaved: true});
        }
    }
    onLoad() {
        //load from api
    }
    checkEsc(event) {
        if (event.keyCode === 27) {
            this.postModalClose();
            this.postFormClose();
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.checkEsc, false);
    }

    render() {
        this.onLoad();
        return (
            <>
                <NavBar id={this.props.match.params.id} />
                <button id="newpostbutton" type="button" onClick={e => this.postFormOpen(e)}>
                    New Post
            </button>
                <PostFeed thePosts={this.state.posts} likeButton={e => this.onClickFeedLikeButton(e)} saveButton={e => this.onClickSaveButton(e)} 
                commentButton={e => this.onClickFeedCommentButton(e)} 
                postModalOpen={this.postModalOpen}></PostFeed> 
                <PostForm show={this.state.postForm} handleClose={e => this.postFormClose(e)}>
                    <div className="mt-3 pt-4">
                        <h2>Make a Post</h2>
                        <form className="pr-5" id="newpostform">
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="origin">Origin of Trip</label>
                                    <input className="form-control" type="text" id="origin"
                                        value={this.state.origin} onChange={e => this.setState({ origin: e.target.value })} required />
                                </div>
                                <div className="col">
                                    <label htmlFor="dest">Destination of Trip</label>
                                    <input className="form-control" type="text" id="dest"
                                        value={this.state.destination} onChange={e => this.setState({ destination: e.target.value })} required />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="text">Describe your Trip</label>
                                    <textarea className="form-control" id="text" rows="5"
                                        value={this.state.text} onChange={e => this.setState({ text: e.target.value })} required />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="price">How expensive was it?</label>
                                    <select className="form-control" id="price" value={this.state.price}
                                        onChange={e => this.setState({ price: e.target.value })} required>
                                        <option></option>
                                        {this.prices.map((x, i) => <option key={i}>{x}</option>)}
                                    </select>
                                </div>
                                <div className="col">
                                    <label htmlFor="rating">Rate your Trip</label>
                                    <select className="form-control" id="rating" value={this.state.rating}
                                        onChange={e => this.setState({ rating: e.target.value })} required>
                                        <option></option>
                                        {this.ratings.map((x, i) => <option key={i}>{x}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="imgurl">Add a Photo (URL)</label>
                                    <input className="form-control" type="text" id="imgurl"
                                        value={this.state.imgurl} onChange={e => this.setState({ imgurl: e.target.value })} required />
                                </div>
                                <div className="col">
                                    <label htmlFor="reaction">Reaction to Trip</label>
                                    <select className="form-control" id="reaction" value={this.state.reaction}
                                        onChange={e => this.setState({ reaction: e.target.value })} required>
                                        <option></option>
                                        {this.reactions.map((x, i) => <option key={i}>{x}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button type="button" className="btn" id="postButton" onClick={() => this.onPost()}>Post</button>
                        </form>
                    </div>
                </PostForm>
                <PostModal id="postmodal" show={this.state.postModal} handleClose={e => this.postModalClose(e)}>
                    <div className="" id="modalcontainer">
                        <h3>{this.state.modalPost.origin} ✈ {this.state.modalPost.destination}</h3>
                        <div className="row py-1">
                            <div className="col">
                                <h5>{this.state.modalPost.username}</h5>
                            </div>
                            <div className="col text-right text-muted">
                                <Rating value={this.state.modalPost.rating} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-muted">
                                <h6>{this.state.modalPost.date}</h6>
                            </div>
                            <div className="col text-right text-muted">
                                <Price value={this.state.modalPost.price} />
                            </div>
                        </div>
                        <div className="row py-1">
                            <img id="modalimg" src={this.state.modalPost.imgurl} />
                        </div>
                        <div className="row py-3">
                            <div className="col">
                                <p>{this.state.modalPost.text}</p>
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col">
                                {/* <button type="button" className="btn mr-2" id="likebutton">
                                👍 Like
                                </button> */}
                                <button type="button" onClick={() => this.onClickFeedLikeButton(this.state.modalPost)} className="btn mr-2" id="likebutton">
                                👍 {!this.state.modalPostLiked && "Like (" + this.state.modalPostNumLikes + ")"}{this.state.modalPostLiked && "Unlike (" + this.state.modalPostNumLikes + ")"}
                                </button>
                                <button type="button" className="btn mr-2" id="commentbutton" onClick={this.scrollToAddComment}>
                                    Comment
                                </button>
                                <button type="button" onClick={() => this.onClickSaveButton(this.state.modalPost)} className="btn mr-2" id="savebutton">
                                {!this.state.modalPostSaved && "Save"}{this.state.modalPostSaved && "Unsave"}
                                </button>
                            </div>
                        </div>
                        <CommentList comments={this.state.modalPost.comments} />
                        <form className="row mt-0 ml-0 pl-0" name="newCommentForm">
                            <div className="ml-0 pl-0" id="newcommenttextarea">
                                <textarea name="newCommentTA" type="text" className="form-control mb-3" placeholder="add a comment" id="newcomment"
                                    value={this.state.newComment}
                                    onChange={e => this.setState({ newComment: e.target.value })} required />
                            </div>
                            <div className="col text-right">
                                {this.state.newComment == "" &&
                                    <button type="button" className="btn mt-2 mr-4" id="newCommentButtonInactive">Post Comment</button>
                                }
                                {this.state.newComment != "" &&
                                    <button type="button" className="btn btn-secondary mt-2 mr-4" id="newCommentButton" onClick={() => this.onNewComment()}>Post Comment</button>
                                }
                            </div>
                        </form>
                    </div>
                </PostModal>
            </>
        );
    }
}
export default Home;