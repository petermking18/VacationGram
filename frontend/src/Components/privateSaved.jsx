import React from 'react';
import PostFeed from './PostFeed';
import { post_card } from '../models/post_card';
import PostCard from './PostCard';
import { Comment } from '../models/comment';
import { Redirect, Link } from 'react-router-dom';
import './privateSaved.css';
import PSNavBar from './psNavBar';
import PostForm from './PostForm';
import PostModal from './PostModal';
import { Rating } from './Rating';
import { Price } from './Price';
import CommentList from './CommentList';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export class PrivateSaved extends React.Component {
    dummyComment1 = new Comment(1, 1, 75, "Pete", 1, false, "Nov 11 2020", "Very cool trip!", 5, false);
    dummyComment2 = new Comment(2, 2, 2, "John Lawrimore", 2, false, "Nov 12 2020", "Seems like you had fun", 2, false);
    dummyPost1 = new post_card(1, 2, "Mark Fontenot", "Nov 9 2020",
        "Dallas", "Hawaii", "https://www.smu.edu/-/media/Images/News/Experts/Mark-Fontenot.jpg?la=en",
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "$$$", "happy", "4 stars", [this.dummyComment1,this.dummyComment2], true, 12, false);
    dummyPost2 = new post_card(2, 1, "Peter King", "Nov 10 2020",
        "Texas", "Washington, DC", "https://dcist.com/wp-content/uploads/sites/3/2020/07/washington-monument-5266903_1920-1500x1000.jpg",
        "I walked around the National Mall and saw some cool buildings!",
        "$$$$$", "fun", "3 stars", [], false, 1, true);

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
            posts: this.dummyPosts,//get from api
        }
    }

    prices = ["$", "$$", "$$$", "$$$$", "$$$$$"];
    ratings = ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"];
    reactions = ["fun", "boring", "exciting", "scary"]

    postModalOpen = (post) => {
        this.setState({ postModal: true });
        this.setState({ modalPost: post });
        this.setState({ modalPostLiked: post.curr_user_liked });
        this.setState({ modalPostNumLikes: post.numlikes });
        this.setState({ modalPostSaved: post.curr_user_saved });
        document.body.style.overflow = "hidden";
    }
    postModalClose = () => {
        this.setState({ postModal: false });
        this.setState({ newComment: "" });
        document.body.style.overflow = "visible";
        this.setState({ posts: this.state.posts });//pull from api again
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
            1, this.state.user_id, this.state.username, date, this.state.origin, this.state.destination, this.state.imgurl,
            this.state.text, this.state.price, this.state.reaction, this.state.rating, [], false, 0, false
        );
        this.state.posts.unshift(mypost);//later this step will post to database
        this.setState(this.state);
        this.postFormClose();
    }
    onNewComment() {
        let dateObj = new Date();
        let date = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
        console.log("commenter: " + this.state.user_id);
        let mycomment = new Comment(
            null/*change to new comment id*/, this.state.modalPost.id, this.state.user_id, this.state.username,
            null/*parent id?*/, null/*is question?*/, date, this.state.newComment, 0, false
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
        console.log(this.state.user_id);
    }
    onClickFeedLikeButton = (post) => {
        if (post.curr_user_liked) {
            //unlike in database
            post.curr_user_liked = false;
            post.numlikes--;
            this.setState({ modalPostLiked: false });
            this.setState({ modalPostNumLikes: this.state.modalPostNumLikes - 1 });
        } else {
            //like in database
            post.curr_user_liked = true;
            post.numlikes++;
            this.setState({ modalPostLiked: true });
            this.setState({ modalPostNumLikes: this.state.modalPostNumLikes + 1 });
        }
    }
    onClickSaveButton = (post) => {
        if (post.curr_user_saved) {
            //unsave in database
            post.curr_user_saved = false;
            this.setState({ modalPostSaved: false });
        } else {
            //save in database
            post.curr_user_saved = true;
            this.setState({ modalPostSaved: true });
        }
        let p;
        for (p in this.state.posts) {
            if (p.post_id === this.state.modalPost.post_id) {
                p.curr_user_saved = this.state.modalPostSaved;
            }
        }
    }
    getPosts = () => {
        return this.state.posts;
    }
    checkEsc(event) {
        if (event.keyCode === 27) {
            this.postModalClose();
            this.setState({ postForm: false });
            this.setState({ origin: "" });
            this.setState({ destination: "" });
            this.setState({ imgurl: "" });
            this.setState({ text: "" });
            this.setState({ price: "" });
            this.setState({ reaction: "" });
            this.setState({ rating: "" });
            document.body.style.overflow = "visible";
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.checkEsc, false);
    }
    componentWillUpdate() {

    }

    render() {
        return (
            <>
                <PSNavBar id={this.props.match.params.id} />
                <PostFeed>
                    <ul class="feed" className="mt-1 bg-light list-unstyled bg-white" id="homefeed">
                        {this.state.posts.map((post, index) => (
                            <PostCard>
                                <li className="container rounded border border-secondary-50 border-top px-0 mt-3">
                                    {/* Top area: origin, dest, username, date, rating, price */}
                                    <div onClick={() => this.postModalOpen(post)} id="postheader" className="bg-light py-2 border-bottom pl-3">
                                        <div className="row">
                                            <div className="col">
                                                <p id="origindest">{post.origin} ✈ {post.destination}</p>
                                            </div>
                                            <div className="col text-right text-muted pr-5">
                                                <Rating value={post.rating} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <p>{post.username}</p>
                                            </div>
                                            <div className="col text-right text-muted pr-5">
                                                <Price value={post.price} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col text-muted">
                                                {post.date}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Middle area: image, text */}
                                    <div className="pl-3 py-2">
                                        <div className="row py-2">
                                            <div className="col">
                                                <img id="postcardimg" src={post.imgurl} />
                                            </div>
                                            <div className="col-9 pl-1 pr-5">
                                                <p>{post.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Bottom area: like button, comment button, save button, numlikes, numcomments */}
                                    <div className="bg-light py-2 border-top pl-3">
                                        <div className="row">
                                            <div className="col">
                                                <button type="button" onClick={() => this.onClickFeedLikeButton(post)} className="btn mr-2" id="likebutton">
                                                👍 {!post.curr_user_liked && "Like"}{post.curr_user_liked && "Unlike"}    
                                                </button>
                                                <button type="button" onClick={() => this.onClickFeedCommentButton(post)} className="btn mr-2" id="commentbutton">
                                                Comment
                                                </button>
                                                <button type="button" onClick={() => this.onClickSaveButton(post)} className="btn mr-2" id="savebutton">
                                                {!post.curr_user_saved && "Save"}{post.curr_user_saved && "Unsave"}
                                                </button>
                                            </div>
                                            <div className="col-4 pr-5 text-right pt-2">
                                                {post.numlikes === 1 && (<t className="mr-3" onClick={() => this.postModalOpen(post)} id="numlikes">1 like</t>)}
                                                {post.numlikes != 1 && (<t className="mr-3" onClick={() => this.postModalOpen(post)} id="numlikes">{post.numlikes} likes</t>)}
                                                {post.comments.length === 1 && (<t onClick={() => this.postModalOpen(post)} id="numcomments">1 comment</t>)}
                                                {post.comments.length != 1 && (<t onClick={() => this.postModalOpen(post)} id="numcomments">{post.comments.length} comments</t>)}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </PostCard>
                        ))}
                    </ul>
                </PostFeed>
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
                        <CommentList comments={this.state.modalPost.comments} curr_user_id={this.state.user_id} poster_id={this.state.modalPost.user_id} />
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

export default PrivateSaved;